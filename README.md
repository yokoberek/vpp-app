## How to start Project

1. Setup virtual environment

    - Create
        ```sh
        python -m venv venv
        ```
    - Initialize
        ```sh
        source venv/bin/activate
        ```
   
2. Install dependencies
    
    ```sh
    pip install -r requirements.txt
    ```

3. Install Tailwind and Other dependecies requirements

    - Go to static folder
        ```sh
        cd app/static/
        ```
    - Install package
        ```sh
        pnpm install
        ```   
    - Install TailwindCSS with Flask
        ```sh
        tailwindcss
        ```
    - Generate CSS File
        ```
        tailwindcss -i ./static/src/main.css -o ./static/dist/main.css --minify
        ```    
    
4. Restart nginx & Supervisor

    - Restart Nginx
        ```sh
        sudo systemctl restart nginx
        ```
    
    - Reload supervisor
        ```sh
        sudo supervisorctl reload
        ```
    
