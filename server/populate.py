import app.database.controller as dbc
from app import create_app, db
from app.database.models import City, Competition, QuestionType, Role


def _add_items():
    media_types = ["Image", "Video"]
    question_types = ["Boolean", "Multiple", "Text"]
    component_types = ["Text", "Image"]
    view_types = ["Team", "Judge", "Audience", "Operator"]

    roles = ["Admin", "Editor"]
    cities = ["Linköping", "Stockholm", "Norrköping", "Örkelljunga"]
    teams = ["Gymnasieskola A", "Gymnasieskola B", "Gymnasieskola C"]

    for name in media_types:
        dbc.add.mediaType(name)

    for name in question_types:
        dbc.add.questionType(name)

    for name in component_types:
        dbc.add.componentType(name)

    for name in view_types:
        dbc.add.viewType(name)

    for name in roles:
        dbc.add.role(name)

    for name in cities:
        dbc.add.city(name)

    admin_id = Role.query.filter(Role.name == "Admin").one().id
    editor_id = Role.query.filter(Role.name == "Editor").one().id

    city_id = City.query.filter(City.name == "Linköping").one().id

    text_id = QuestionType.query.filter(QuestionType.name == "Text").one().id

    # Add users
    dbc.add.user("admin@test.se", "password", admin_id, city_id)
    dbc.add.user("test@test.se", "password", editor_id, city_id)

    # Add competitions to db
    for i in range(3):
        dbc.add.competition(f"Test{i+1}", 1971, city_id)

    item_comps = Competition.query.all()

    for item_comp in item_comps:
        for item_slide in item_comp.slides:
            dbc.edit.slide(item_slide, timer=5)

            for i in range(3):
                dbc.add.question(f"Q{i+1}", i + 1, text_id, item_slide)

        # Add teams to competition
        for team_name in teams:
            dbc.add.team(team_name, item_comp)


if __name__ == "__main__":
    app, _ = create_app("configmodule.DevelopmentConfig")

    with app.app_context():
        db.drop_all()
        db.create_all()
        _add_items()
