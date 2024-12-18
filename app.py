import os
from flask import Flask, render_template, send_from_directory, abort, redirect

app = Flask(__name__, static_folder='assets', template_folder='.')

# routes for main pages
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projects')
@app.route('/projects/')
def projects_home():
    return render_template('projects.html')

# general dynamic route 
@app.route('/<page_name>')
def generic_page(page_name):
    page_file = f'{page_name}.html' 
    if os.path.exists(page_file): 
        return render_template(page_file)
    else:
        return abort(404) 

# general dynamic route to handle .html removal
@app.route('/<page_name>.html')
def redirect_page_html(page_name):
    page_file = f'{page_name}.html' 
    if os.path.exists(page_file): 
        return redirect(f'/{page_name}', code=301)  
    else:
        return abort(404) 

# general dynamic route for projects
@app.route('/projects/<project_name>')
def project_page(project_name):
    project_file = f'projects/{project_name}.html' 
    if os.path.exists(project_file): 
        return render_template(project_file)
    else:
        return abort(404) 

# general dynamic route for projects to handle .html removal
@app.route('/projects/<project_name>.html')
def redirect_project_html(project_name):
    project_file = f'projects/{project_name}.html' 
    if os.path.exists(project_file):
        return redirect(f'/projects/{project_name}', code=301)
    else:
        return abort(404) 

# serve the resume pdf
@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory('assets/download', filename)

# serve the sitemap
@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory('.', 'sitemap.xml')

# run app
if __name__ == '__main__':
    app.run(debug=False)
