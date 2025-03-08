from flask import Flask, jsonify, render_template, url_for
from flask_frozen import Freezer
import os
import frontmatter
import markdown
import json
import shutil

app = Flask(__name__)
freezer = Freezer(app)

def load_posts(directory):
    posts = []
    md = markdown.Markdown(extensions=['codehilite', 'fenced_code'])

    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            with open(os.path.join(directory, filename), 'r') as f:
                post = frontmatter.load(f)
                metadata = post.metadata
                content_html = md.convert(post.content)
                slug = metadata.get('slug', os.path.splitext(filename)[0])
                posts.append({
                    'metadata': metadata,
                    'content_html': content_html,
                    'slug': slug
                })
    return posts

POSTS = load_posts('posts')
HIGHLIGHTS = load_posts('highlights')

# Route for the homepage
@app.route('/', endpoint='index')
def index():
    latest_posts = sorted(POSTS, key=lambda p: p['metadata'].get('date', ''), reverse=True)[:10]
    return render_template('index.html', posts=latest_posts, highlights=HIGHLIGHTS)

# Route for the posts list
@app.route('/posts/', endpoint='posts')
def posts_list():
    return render_template('posts_list.html', posts=POSTS)

# Route for individual posts
@app.route('/posts/<slug>.html', endpoint='post')
def post(slug):
    post = next((p for p in POSTS if p["slug"] == slug), None)
    if post:
        return render_template('post.html', post=post)
    return "Post not found", 404

# Route for the highlights list
@app.route('/highlights/', endpoint='highlights')
def highlights_list():
    return render_template('highlights_list.html', highlights=HIGHLIGHTS)

# Route for individual highlights
@app.route('/highlights/<slug>.html', endpoint='highlight')
def highlight(slug):
    highlight = next((h for h in HIGHLIGHTS if h['slug'] == slug), None)
    if highlight:
        return render_template('post.html', post=highlight)  # Reuse post.html
    return "Highlight not found", 404

# Route for search.json
@app.route('/search.json', endpoint='search_json')
def search_json():
    data = {"posts": POSTS, "highlights": HIGHLIGHTS}
    return jsonify(data)

# Freezer configuration for static site generation
@freezer.register_generator
def post():
    for post in POSTS:
        yield {'slug': post['slug']}

@freezer.register_generator
def highlight():
    for h in HIGHLIGHTS:
        yield {'slug': h['slug']}



if __name__ == '__main__':
  
    freezer.freeze()  # Generates static files
    app.run()