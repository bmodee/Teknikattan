import random

import app.database.controller as dbc
from app import create_app, db
from app.database.models import City, QuestionType, Role


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

    # Add users
    dbc.add.user("admin@test.se", "password", admin_id, city_id)
    dbc.add.user("test@test.se", "password", editor_id, city_id)

    question_types_items = dbc.get.all(QuestionType)

    # Add competitions
    for i in range(len(question_types_items)):
        item_comp = dbc.add.competition(f"Tävling {i}", 2000 + i, city_id)
        dbc.edit.slide(item_comp.slides[0], timer=5, title="test-slide-title")

        # Add two more slides to competition
        dbc.add.slide(item_comp)
        dbc.add.slide(item_comp)

        # Add slides
        for j, item_slide in enumerate(item_comp.slides):
            # Populate slide with data
            item_slide.title = f"Slide {j}"
            item_slide.body = f"Body {j}"
            item_slide.timer = 100 + j
            # item_slide.settings = "{}"
            dbc.utils.commit_and_refresh(item_slide)

            # Add question to competition
            item_question = dbc.add.question(
                name=f"Question {j}: {question_types_items[j].name}",
                total_score=j,
                type_id=question_types_items[j].id,
                item_slide=item_slide,
            )

            for i in range(3):
                dbc.add.question_alternative(f"Alternative {i}", 0, item_question.id)

            # Add text components
            # TODO: Add images as components
            for k in range(3):
                x = random.randrange(1, 500)
                y = random.randrange(1, 500)
                w = random.randrange(150, 400)
                h = random.randrange(150, 400)
                dbc.add.component(1, item_slide, {"text": f"hej{k}"}, x, y, w, h)

        item_slide = dbc.add.slide(item_comp)
        item_slide.title = f"Slide {len(item_comp.slides)}"
        item_slide.body = f"Body {len(item_comp.slides)}"
        item_slide.timer = 100 + j
        # item_slide.settings = "{}"
        dbc.utils.commit_and_refresh(item_slide)

        # Add teams
        for name in teams:
            dbc.add.team(f"{name}{i}", item_comp)


if __name__ == "__main__":
    app, _ = create_app("configmodule.DevelopmentConfig")

    with app.app_context():
        db.drop_all()
        db.create_all()
        _add_items()
