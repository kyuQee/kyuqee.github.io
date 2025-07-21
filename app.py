from flask import Flask, jsonify, render_template, url_for
import os
import frontmatter
import markdown
import json
import shutil
from flask_frozen import Freezer
import re

app = Flask(__name__)
freezer = Freezer(app)

def get_snippet(content, word_limit=50):
    """Extract text under the first heading, limited to word_limit words."""
    # Split content by lines and look for the first heading
    lines = content.split('\n')
    in_first_section = False
    snippet_lines = []
    
    for line in lines:
        # Detect first heading (e.g., # Introduction)
        if re.match(r'^#+\s+', line):
            if not in_first_section:
                in_first_section = True
                continue  # Skip the heading itself
            else:
                break  # Stop at the next heading
        # Collect lines after the first heading
        if in_first_section and line.strip():
            snippet_lines.append(line)
    
    # Join lines and limit to word_limit words
    snippet = ' '.join(snippet_lines).strip()
    words = snippet.split()
    if len(words) <= word_limit:
        return snippet
    return ' '.join(words[:word_limit]) + '...'

def load_posts(directory):
    posts = []
    md = markdown.Markdown(extensions=['codehilite', 'fenced_code', 'toc'])
    
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            try:
                with open(os.path.join(directory, filename), 'r', encoding='utf-8') as f:
                    post = frontmatter.load(f)
                    metadata = post.metadata
                    content_html = md.convert(post.content)
                    slug = metadata.get('slug', os.path.splitext(filename)[0])
                    toc = md.toc if hasattr(md, 'toc') else ""
                    snippet = get_snippet(post.content)
                    snippet_html = md.convert(snippet)
                    # Ensure tags exist, default to empty list
                    metadata['tags'] = metadata.get('tags', [])
                    posts.append({
                        'metadata': metadata,
                        'content_html': content_html,
                        'slug': slug,
                        'toc': toc,
                        'snippet': snippet_html
                    })
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    return posts

POSTS = load_posts('posts')
HIGHLIGHTS = load_posts('highlights')
ABOUT = load_posts('about')

# Collect all unique tags
ALL_TAGS = set()
for post in POSTS:
    ALL_TAGS.update(post['metadata']['tags'])
for highlight in HIGHLIGHTS:
    ALL_TAGS.update(highlight['metadata'].get('tags', []))
ALL_TAGS = sorted(ALL_TAGS)

@app.route('/', endpoint='index')
def index():
    latest_posts = sorted(POSTS, key=lambda p: p['metadata'].get('date', ''), reverse=True)[:10]
    return render_template('index.html', posts=latest_posts, highlights=HIGHLIGHTS, all_tags=ALL_TAGS)

@app.route('/posts/', endpoint='posts')
def posts_list():
    return render_template('posts_list.html', posts=POSTS)

@app.route('/posts/<slug>.html', endpoint='post')
def post(slug):
    post = next((p for p in POSTS if p["slug"] == slug), None)
    if post:
        return render_template('post.html', post=post)
    return "Post not found", 404

@app.route('/highlights/', endpoint='highlights')
def highlights_list():
    return render_template('highlights_list.html', highlights=HIGHLIGHTS)

@app.route('/highlights/<slug>.html', endpoint='highlight')
def highlight(slug):
    highlight = next((h for h in HIGHLIGHTS if h['slug'] == slug), None)
    if highlight:
        return render_template('post.html', post=highlight)
    return "Highlight not found", 404

@app.route('/about/', endpoint='about')
def about():
    about_content = ABOUT[0] if ABOUT else None
    if about_content:
        return render_template('about.html', about=about_content)
    return "About page not found", 404

@app.route('/search.json', endpoint='search_json')
def search_json():
    data = {"posts": POSTS, "highlights": HIGHLIGHTS}
    return jsonify(data)

@freezer.register_generator
def post():
    for post in POSTS:
        yield {'slug': post['slug']}

@freezer.register_generator
def highlight():
    for h in HIGHLIGHTS:
        yield {'slug': h['slug']}

if __name__ == '__main__':
    try:
        freezer.freeze()
    except Exception as e:
        print(f"Error during freeze: {e}")
    #app.run(debug=True)