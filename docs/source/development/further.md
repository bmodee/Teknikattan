# Further development

Because the project was time limited a lot is left to be done.
Below we will give two different types of things to improve.
The first type is functionality, bugs and aesthetics which improves the usability of the system.
The second type is refactoring which is basically just things related to the source code.
This won't effect the end user but will certainly improve the system as a whole.

## Functionality, bugs and aesthetics

Most of the basic functionality of the system is already completed.
There are however a few major things left to be done.

### Different question types

The system needs to support a lot of different types of questions.
A list of all the questions that needs to be supported (and more) can be found on [Teknikattan scoring system](https://github.com/TechnoX/teknikattan-scoring-system/blob/master/kandidatarbete_teknikattan.md).

## Refactoring

Here we will give a list of things we think will improve the system.
It is not certain that they are a better solutions but definitely something to look into.

### Replace Flask-RESTX with flask-smorest

[comment]: # (This is already implemented)

We currently use [Flask-RESTX](https://flask-restx.readthedocs.io/en/latest/) to define our endpoints and parse the arguments they take, either as a query string or in the body.
But when responding we use [Marshmallow](https://flask-smorest.readthedocs.io/en/latest/) to generate the JSON objects to return.
We believe that [flask-smorest](https://flask-smorest.readthedocs.io/en/latest/) would integrate a lot better with Marshmallow.
This would give us the ability to more easily show the expected arguments and the return values for our endpoints using Swagger (when visiting `localhost:5000`).
Currently we only show the route.
The work required also seems to be rather small because they look quite similar.
This would also remove the deprecated [reqparse](https://flask-restx.readthedocs.io/en/latest/parsing.html) part from Flask-RESTX, which is desirable.
