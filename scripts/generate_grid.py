import os
import datetime
import json
import urllib.request
import math
import random
import base64
from collections import Counter

# Configuration
GITHUB_USERNAME = "mel-cell"
OUTPUT_FILE = "assets/grid.svg"

# Monochrome Ultra Premium Theme
THEME = {
    "bg": "#050505",          
    "card_bg": "#111111",     
    "text_main": "#ffffff",
    "text_dim": "#888888",
    "border": "#222222",
    "palette": [
        "#ffffff", "#f2f2f2", "#e5e5e5", "#d8d8d8", "#cccccc", 
        "#bfbfbf", "#b2b2b2", "#a5a5a5", "#999999", "#8c8c8c",
        "#808080", "#737373", "#666666", "#595959", "#4d4d4d"
    ]
}

def fetch_json(url):
    try:
        req = urllib.request.Request(url)
        req.add_header('User-Agent', 'Python-Script')
        token = os.environ.get('GITHUB_TOKEN')
        if token:
            req.add_header('Authorization', f'token {token}')
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def fetch_graphql(query, variables):
    url = "https://api.github.com/graphql"
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        print("Error: GITHUB_TOKEN is missing. Cannot fetch GraphQL data.")
        return None
        
    data = json.dumps({"query": query, "variables": variables}).encode('utf-8')
    try:
        req = urllib.request.Request(url, data=data, method='POST')
        req.add_header('User-Agent', 'Python-Script')
        req.add_header('Authorization', f'bearer {token}')
        req.add_header('Content-Type', 'application/json')
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error fetching GraphQL: {e}")
        return None

def get_local_image_base64(path):
    try:
        if os.path.exists(path):
            with open(path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode()
    except Exception as e:
        print(f"Error reading image {path}: {e}")
    return None

def calculate_streaks(weeks):
    days = []
    for week in weeks:
        days.extend(week['contributionDays'])
    days.sort(key=lambda x: x['date'])
    
    current_streak = 0
    longest_streak = 0
    temp_streak = 0
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    
    for day in reversed(days):
        if day['contributionCount'] > 0:
            current_streak += 1
        else:
            if day['date'] == today_str:
                continue
            break
            
    for day in days:
        if day['contributionCount'] > 0:
            temp_streak += 1
        else:
            if temp_streak > longest_streak:
                longest_streak = temp_streak
            temp_streak = 0
    if temp_streak > longest_streak:
        longest_streak = temp_streak
        
    return current_streak, longest_streak

def calculate_grade(total_contributions):
    if total_contributions >= 2000: return "S+"
    if total_contributions >= 1000: return "A+"
    if total_contributions >= 500:  return "A"
    if total_contributions >= 200:  return "B+"
    if total_contributions >= 100:  return "B"
    if total_contributions >= 50:   return "C+"
    return "C"

def get_real_stats(username):
    user_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?per_page=100&type=owner"
    
    user_data = fetch_json(user_url)
    repos_data = fetch_json(repos_url)
    
    if not user_data or not repos_data:
        return {
            "stats": {"total_stars": 0, "total_forks": 0, "followers": 0, "total_repos": 0, "avatar": "", "commits": 0, "prs": 0, "issues": 0},
            "languages": []
        }

    total_stars = sum(repo['stargazers_count'] for repo in repos_data)
    total_forks = sum(repo['forks_count'] for repo in repos_data)
    
    query = """
    query($userName:String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
        }
      }
    }
    """
    
    gql_data = fetch_graphql(query, {"userName": username})
    
    total_contributions = 0
    current_streak = 0
    longest_streak = 0
    total_commits = 0
    total_prs = 0
    total_issues = 0
    
    if gql_data and 'data' in gql_data and 'user' in gql_data['data']:
        contrib_data = gql_data['data']['user']['contributionsCollection']
        calendar = contrib_data['contributionCalendar']
        
        total_contributions = calendar['totalContributions']
        total_commits = contrib_data['totalCommitContributions']
        total_prs = contrib_data['totalPullRequestContributions']
        total_issues = contrib_data['totalIssueContributions']
        
        current_streak, longest_streak = calculate_streaks(calendar['weeks'])
    
    grade = calculate_grade(total_contributions)
    avatar_b64 = get_local_image_base64("assets/image.png")
    
    langs = []
    for repo in repos_data:
        if repo['language']:
            langs.append(repo['language'])
            
    lang_counts = Counter(langs)
    total_langs = sum(lang_counts.values())
    
    top_languages = []
    sorted_langs = lang_counts.most_common()
    
    current_sum = 0
    limit = 10
    for i, (lang, count) in enumerate(sorted_langs[:limit]):
        percent = (count / total_langs) * 100
        top_languages.append({
            "name": lang,
            "percent": percent,
            "color": THEME['palette'][i % len(THEME['palette'])]
        })
        current_sum += percent
        
    if len(sorted_langs) > limit:
        top_languages.append({
            "name": "Others",
            "percent": 100 - current_sum,
            "color": "#333333"
        })

    return {
        "stats": {
            "total_stars": total_stars,
            "total_forks": total_forks,
            "followers": user_data['followers'],
            "total_repos": user_data['public_repos'],
            "bio": user_data.get('bio', 'Full Stack Developer'),
            "name": user_data.get('name', username),
            "avatar": avatar_b64,
            "total_contributions": total_contributions,
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "total_commits": total_commits,
            "total_prs": total_prs,
            "total_issues": total_issues,
            "grade": grade
        },
        "languages": top_languages
    }

def polar_to_cartesian(cx, cy, radius, angle_in_degrees):
    angle_in_radians = (angle_in_degrees - 90) * math.pi / 180.0
    return {
        "x": cx + (radius * math.cos(angle_in_radians)),
        "y": cy + (radius * math.sin(angle_in_radians))
    }

def describe_arc(x, y, radius, start_angle, end_angle):
    start = polar_to_cartesian(x, y, radius, end_angle)
    end = polar_to_cartesian(x, y, radius, start_angle)
    large_arc_flag = "0" if end_angle - start_angle <= 180 else "1"
    return f"M {x} {y} L {start['x']} {start['y']} A {radius} {radius} 0 {large_arc_flag} 0 {end['x']} {end['y']} Z"

def make_donut_chart(languages, cx, cy, radius):
    svg_paths = ""
    start_angle = 0
    languages.sort(key=lambda x: x['percent'], reverse=True)
    
    for lang in languages:
        degrees = (lang['percent'] / 100) * 360
        end_angle = start_angle + degrees
        if degrees > 1:
            path_d = describe_arc(cx, cy, radius, start_angle, end_angle)
            svg_paths += f'<path d="{path_d}" fill="{lang["color"]}" stroke="{THEME["card_bg"]}" stroke-width="2" />'
        start_angle = end_angle
        
    svg_paths += f'<circle cx="{cx}" cy="{cy}" r="{radius * 0.6}" fill="{THEME["card_bg"]}" />'
    return svg_paths

def make_dense_sparkline(width, height):
    points = []
    steps = 50 
    step_w = width / (steps - 1)
    prev_y = height / 2
    path_d = f"M 0 {height}" 
    line_points = []
    for i in range(steps):
        x = i * step_w
        change = random.randint(-15, 15)
        y = prev_y + change
        y = max(10, min(height - 10, y))
        prev_y = y
        line_points.append(f"{x},{y}")
    path_d += " L " + " L ".join(line_points) + f" L {width} {height} Z"
    stroke_d = "M " + " L ".join(line_points)
    
    return f'''
    <defs>
        <linearGradient id="gradSpark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:{THEME['text_main']};stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:{THEME['text_main']};stop-opacity:0" />
        </linearGradient>
    </defs>
    <path d="{path_d}" fill="url(#gradSpark)" />
    <path d="{stroke_d}" fill="none" stroke="{THEME['text_main']}" stroke-width="1.5" />
    '''

def create_svg(data):
    stats = data['stats']
    languages = data['languages']
    
    width = 1000
    height = 850 
    
    svg = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <style>
        .text {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; fill: {THEME['text_main']}; }}
        .text-dim {{ fill: {THEME['text_dim']}; }}
        .card {{ fill: {THEME['card_bg']}; }}
        .label {{ font-size: 12px; fill: {THEME['text_dim']}; }}
        .value {{ font-size: 32px; font-weight: bold; fill: {THEME['text_main']}; }}
        .value-sm {{ font-size: 24px; font-weight: bold; fill: {THEME['text_main']}; }}
    </style>
    <rect width="{width}" height="{height}" fill="{THEME['bg']}" rx="0"/>
    '''

    # --- GRID LAYOUT ---
    
    # 1. IMAGE CARD (Top Left)
    img_b64 = stats.get('avatar', '')
    img_content = f'<image x="0" y="0" width="320" height="320" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/png;base64,{img_b64}" clip-path="url(#clip1)" />' if img_b64 else ''
    svg += f'''
    <defs><clipPath id="clip1"><rect width="320" height="320" rx="24"/></clipPath></defs>
    <g transform="translate(0, 0)">
        <rect width="320" height="320" class="card" rx="24"/>
        {img_content}
        <rect width="320" height="320" rx="24" fill="url(#imgOverlay)" style="mix-blend-mode: multiply;"/>
        <defs><linearGradient id="imgOverlay" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="black" stop-opacity="0"/><stop offset="100%" stop-color="black" stop-opacity="0.6"/></linearGradient></defs>
    </g>
    '''

    # 2. STATS 1 (Stars)
    svg += f'''
    <g transform="translate(340, 0)">
        <rect width="150" height="150" class="card" rx="24"/>
        <text x="20" y="35" class="label">Total Stars</text>
        <text x="20" y="80" class="value">{stats['total_stars']}</text>
    </g>
    '''

    # 3. STATS 2 (Contributions)
    current_year = datetime.datetime.now().year
    svg += f'''
    <g transform="translate(510, 0)">
        <rect width="150" height="150" class="card" rx="24"/>
        <text x="20" y="35" class="label">Contribs (Year)</text>
        <text x="20" y="80" class="value">{stats['total_contributions']}</text>
        <text x="130" y="35" text-anchor="end" font-size="16">⚡</text>
    </g>
    '''

    # 4. ACTIVITY (Middle Center)
    svg += f'''
    <g transform="translate(340, 170)">
        <rect width="320" height="150" class="card" rx="24"/>
        <text x="20" y="30" class="label">Activity Pulse</text>
        <g transform="translate(0, 40)">{make_dense_sparkline(320, 110)}</g>
    </g>
    '''

    # 5. LANGUAGE SHARE (Right)
    svg += f'''
    <g transform="translate(680, 0)">
        <rect width="320" height="480" class="card" rx="24"/>
        <text x="25" y="35" class="label">Language Share</text>
        
        <g transform="translate(160, 140)">
            {make_donut_chart(languages, 0, 0, 90)}
            <text x="0" y="5" text-anchor="middle" fill="{THEME['text_main']}" font-size="20" font-weight="bold">{len(languages)}</text>
            <text x="0" y="20" text-anchor="middle" fill="{THEME['text_dim']}" font-size="10">LANGS</text>
        </g>
        
        <g transform="translate(25, 260)">
    '''
    
    for i, lang in enumerate(languages[:10]): 
        col = i % 2
        row = i // 2
        lx = col * 140
        ly = row * 25
        svg += f'''
        <circle cx="{lx}" cy="{ly}" r="4" fill="{lang['color']}"/>
        <text x="{lx + 15}" y="{ly + 4}" font-size="12" fill="{THEME['text_dim']}">{lang['name']}</text>
        <text x="{lx + 110}" y="{ly + 4}" font-size="12" fill="{THEME['text_main']}" text-anchor="end">{int(lang['percent'])}%</text>
        '''
        
    svg += '''
        </g>
    </g>
    '''

    # --- ROW 2 ---
    
    # 6. PROFILE INFO (Bottom Left)
    svg += f'''
    <g transform="translate(0, 340)">
        <rect width="490" height="260" class="card" rx="24"/>
        <text x="30" y="50" class="text" font-size="32" font-weight="bold">{stats['name']}</text>
        <text x="30" y="80" class="text-dim" font-size="18">@{GITHUB_USERNAME}</text>
        <text x="30" y="140" class="text" font-size="16" width="400">{stats['bio']}</text>
        <rect x="30" y="200" width="120" height="30" rx="15" fill="#ffffff" fill-opacity="0.1"/>
        <text x="90" y="220" text-anchor="middle" font-size="12" fill="white">Available</text>
    </g>
    '''

    # 7. FOLLOWERS (Bottom Middle)
    svg += f'''
    <g transform="translate(510, 340)">
        <rect width="150" height="260" class="card" rx="24"/>
        <text x="75" y="40" text-anchor="middle" class="label">Followers</text>
        <text x="75" y="130" text-anchor="middle" font-size="48" font-weight="bold" fill="{THEME['text_main']}">{stats['followers']}</text>
        <circle cx="75" cy="200" r="20" stroke="{THEME['text_dim']}" stroke-width="1" fill="none"/>
        <circle cx="75" cy="200" r="10" fill="{THEME['text_main']}"/>
    </g>
    '''

    # 8. CLOCK / DATE (Bottom Right)
    now = datetime.datetime.now()
    time_str = now.strftime("%H:%M")
    date_str = now.strftime("%d %b %Y")
    
    svg += f'''
    <g transform="translate(680, 500)">
        <rect width="320" height="100" class="card" rx="24"/>
        <text x="30" y="65" font-size="48" font-weight="bold" fill="{THEME['text_main']}">{time_str}</text>
        <text x="180" y="65" font-size="18" fill="{THEME['text_dim']}">{date_str}</text>
    </g>
    '''

    # --- NEW SECTION: STATS & STREAK (Bottom) ---
    
    # Left Box: GitHub Stats
    svg += f'''
    <g transform="translate(0, 620)">
        <rect width="490" height="200" class="card" rx="24"/>
        <text x="30" y="40" font-size="16" font-weight="bold" fill="{THEME['text_main']}">GitHub Stats</text>
        
        <g transform="translate(30, 70)">
            <text x="0" y="0" class="label">Total Stars Earned:</text>
            <text x="200" y="0" class="text" font-weight="bold">{stats['total_stars']}</text>
            
            <text x="0" y="30" class="label">Total Commits ({current_year}):</text>
            <text x="200" y="30" class="text" font-weight="bold">{stats['total_commits']}</text>
            
            <text x="0" y="60" class="label">Total PRs:</text>
            <text x="200" y="60" class="text" font-weight="bold">{stats['total_prs']}</text>
            
            <text x="0" y="90" class="label">Total Issues:</text>
            <text x="200" y="90" class="text" font-weight="bold">{stats['total_issues']}</text>
        </g>
        
        <!-- Dynamic Grade Circle -->
        <g transform="translate(380, 100)">
            <circle r="40" fill="none" stroke="{THEME['border']}" stroke-width="8"/>
            <circle r="40" fill="none" stroke="{THEME['text_main']}" stroke-width="8" stroke-dasharray="200" stroke-dashoffset="150" transform="rotate(-90)"/>
            <text x="0" y="5" text-anchor="middle" font-weight="bold" font-size="24" fill="{THEME['text_main']}">{stats['grade']}</text>
        </g>
    </g>
    '''
    
    # Right Box: Streak Stats
    svg += f'''
    <g transform="translate(510, 620)">
        <rect width="490" height="200" class="card" rx="24"/>
        
        <g transform="translate(80, 80)">
            <text x="0" y="0" text-anchor="middle" font-size="32" font-weight="bold" fill="{THEME['text_main']}">{stats['total_contributions']}</text>
            <text x="0" y="30" text-anchor="middle" class="label">Total</text>
            <text x="0" y="45" text-anchor="middle" class="label">Contributions</text>
        </g>
        
        <line x1="160" y1="40" x2="160" y2="160" stroke="{THEME['border']}" stroke-width="2"/>
        
        <g transform="translate(245, 100)">
            <circle r="50" fill="none" stroke="{THEME['border']}" stroke-width="4"/>
            <circle r="50" fill="none" stroke="{THEME['text_main']}" stroke-width="4" stroke-dasharray="314" stroke-dashoffset="100" transform="rotate(-90)"/>
            <text x="0" y="-10" text-anchor="middle" font-size="16">🔥</text>
            <text x="0" y="20" text-anchor="middle" font-size="32" font-weight="bold" fill="{THEME['text_main']}">{stats['current_streak']}</text>
            <text x="0" y="70" text-anchor="middle" class="label">Current Streak</text>
        </g>
        
        <line x1="330" y1="40" x2="330" y2="160" stroke="{THEME['border']}" stroke-width="2"/>
        
        <g transform="translate(410, 80)">
            <text x="0" y="0" text-anchor="middle" font-size="32" font-weight="bold" fill="{THEME['text_main']}">{stats['longest_streak']}</text>
            <text x="0" y="30" text-anchor="middle" class="label">Longest</text>
            <text x="0" y="45" text-anchor="middle" class="label">Streak</text>
        </g>
    </g>
    '''

    svg += "</svg>"
    return svg

def main():
    data = get_real_stats(GITHUB_USERNAME)
    svg_content = create_svg(data)
    
    with open(OUTPUT_FILE, "w") as f:
        f.write(svg_content)
    print(f"Generated {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
