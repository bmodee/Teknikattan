from app import create_app, db

# Development port
DEFAULT_DEV_PORT = 5000

# Production port
DEFAULT_PRO_PORT = 8080

if __name__ == "__main__":
    app = create_app("configmodule.DevelopmentConfig")
    with app.app_context():
        db.create_all()
    app.run(port=5000)
    # CONFIG = "configmodule.DevelopmentConfig"

    # if "production-teknik8" in os.environ:
    #     CONFIG = "configmodule.ProductionConfig"

    # if "configmodule.DevelopmentConfig" == CONFIG:
    #     app.run(port=DEFAULT_DEV_PORT)
    # else:
    #     app.run(host="0.0.0.0", port=DEFAULT_PRO_PORT)
