import os
from pathlib import Path
import sqlite3
from flask import Flask, render_template, request, redirect,Response

from video_processor import VideoProcessor

app = Flask(__name__)

# Configuration
app.config['VIDEO_PATH'] = Path(app.root_path) / 'static' / 'video' / 'cctv_demo_detection.mp4'
app.config['MODEL_PATH'] = Path(app.root_path) / 'models' / 'best.pt'

# Global video processor instance
processor = VideoProcessor(
    app.config['VIDEO_PATH'], 
    model_path=app.config['MODEL_PATH']
)

@app.route('/')
def index():
    """Render the home page."""
    return render_template('index.html')

@app.route('/signup')
def signup():
    """Render the signup page."""
    return render_template('signup.html')

@app.route('/monitoring')
def monitoring():
    """Render the monitoring dashboard."""

    conn = sqlite3.connect('database.db')
    cur = conn.cursor()

    cur.execute("SELECT * FROM videos")
    videos = cur.fetchall()

    conn.close()

    return render_template('monitoring.html', videos=videos)

@app.route('/admin')
def admin():
    """Render the admin dashboard."""
    return render_template('admin.html')

@app.route('/video_feed')
def video_feed():
    """Stream video frames."""
    return Response(processor.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/stats')
def get_stats():
    """Return current inference statistics."""
    return processor.get_stats()

@app.route('/add_video', methods=['POST'])
def add_video():

    import os, sqlite3

    name = request.form['name']
    location = request.form['location']

    file = request.files['video']

    filename = file.filename

    file.save(os.path.join('static/video', filename))

    conn = sqlite3.connect('database.db')
    cur = conn.cursor()


    # ✅ CREATE TABLE FIRST
    cur.execute("""
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        filename TEXT
    )
    """)


    # ✅ INSERT VIDEO
    cur.execute(
        "INSERT INTO videos (name, filename) VALUES (?,?)",
        (name, filename)
    )

    conn.commit()
    conn.close()

    return redirect('/admin')
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
