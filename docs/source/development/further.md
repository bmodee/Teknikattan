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

### Scaling of components
Components rendered in SlideDisplay.tsx in client are scaled inconsistently and should use [scale transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale()) from CSS.

## Refactoring

Here we will give a list of things we think will improve the system.
It is not certain that they are a better solutions but definitely something to look into.

### Server configuration

The server can be configured to run in development or production mode and can use either sqllite or postgresql.
The code to handle these configuration options were written very late in the project and should be refactored, maybe using [argparse](https://docs.python.org/3/library/argparse.html).

