import datetime


def parse_date(date_to_parse):
    return datetime.datetime.strptime(date_to_parse, "%Y-%m-%d").date()
