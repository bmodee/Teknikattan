# Further development

Because the project was time limited a lot is left to be done.
A few ideas for things to be improved are given here.

## Replacing reqparse

As mentioned in [Parsing request](../overview/server.html#parsing-request), the reqparse module from RestX is deprecated and should be replaced with for example marshmallow.
Parsing is a rather small and simple matter which makes it quite fine not to use the most optimal tool, but it should nevertheless be replaced.
This would also make it possible to generate better documentation by providing both the expected paramters and return value from an API.
This was looked into and deemed not trivial with the current solution.
