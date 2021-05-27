from app import create_app

if __name__ == "__main__":
    app, sio = create_app("configmodule.ProductionConfig")
    sio.run(app, port=5000)
