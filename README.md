# Panduan Pengaturan Proyek

## Prasyarat

Sebelum memulai, pastikan Anda terhubung dengan wifi di lingkungan Kampus ITS atau terhubung melalui VPN ITS untuk kelancaran setup dan implementasi proyek.

## Pengaturan Lingkungan

1. **Virtual Environment Setup**

    - **Creation**: Establish a virtual environment to isolate your project dependencies.
        ```sh
        python -m venv venv
        ```
    - **Activation**: Activate the virtual environment.
        ```sh
        source venv/bin/activate
        ```

2. **Dependency Installation**

    Install the required Python packages specified in the `requirements.txt` file.
    ```sh
    pip install -r requirements.txt
    ```

## TailwindCSS and Additional Dependencies

1. **Navigate to Static Directory**

    Change to the `app/static/` directory, where static resources like CSS and JavaScript are located.
    ```sh
    cd app/static/
    ```

2. **Package Installation**

    Use `pnpm` to install the necessary packages.
    ```sh
    pnpm install
    ```

3. **TailwindCSS Integration**

    - Install TailwindCSS specifically for Flask integration.
        ```sh
        tailwindcss
        ```
    - Generate the CSS file, minifying it in the process.
        ```sh
        tailwindcss -i ./css/src/main.css -o ./css/dist/main.css --minify
        ```

## Starting the Project

After setting up the environment and dependencies:

1. **Navigate Back to Project Root**

    Ensure you're in the root directory of the project to start the server.

2. **Server Execution**

    Use Gunicorn to serve the application.
    ```sh
    gunicorn -w 3 -b localhost:5000 run:app
    ```

3. **Accessing the Application**

    Open your web browser and go to `http://localhost:5000` to view the application.

## Docker Setup

For Docker users, ensure Docker is installed on your device. Execute the following commands at the root of the project:

1. **Build Docker Image**

    Create a Docker image for the project.
    ```sh
    docker build -t vpp:1.0 .
    ```

2. **Run Docker Container**

    Start a container using the image created.
    ```sh
    docker run --name vpp-app -d -p 5000:5000 vpp:1.0
    ```

---

# Project Structure Documentation

- `app/main/`: Contains core functionalities of the application.
- `app/users/`: Manages user authentication and related functionalities.
- `app/static/`: Hosts static files like CSS, JavaScript, and images.
    - `js/chartjs/`: Includes JavaScript code for chart functionalities within the application.
- `templates/`: Directory designated for HTML templates used across the application.

---

# Technology Stack

- **Back-end Framework**: Flask (Python)
- **Front-end Libraries**: ChartJS (JavaScript) for data visualization
- **Database**: Integrated with a server in the IS Department for data management and storage.
