# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.

import os
import sys

basepath = os.path.dirname(__file__)
filepath = os.path.abspath(os.path.join(basepath, "../.."))
sys.path.insert(0, filepath)


# -- Project information -----------------------------------------------------

project = "Teknikattan scoring system"
copyright = "2021, Albin Henriksson, Sebastian Karlsson, Victor Löfgren, Björn Modée, Josef Olsson, Max Rüdinger, Carl Schönfelder, Emil Wahlqvist"
author = "Albin Henriksson, Sebastian Karlsson, Victor Löfgren, Björn Modée, Josef Olsson, Max Rüdinger, Carl Schönfelder, Emil Wahlqvist"
version = "1.0"

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = ["sphinx.ext.autodoc", "myst_parser"]

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []

autodoc_member_order = "bysource"

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = "alabaster"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
# html_static_path = ["_static"]

# If true, the current module name will be prepended to all description
# unit titles (such as .. function::).
add_module_names = False


logo_path = os.path.abspath(os.path.join(basepath, "../../app/static/images/t8.jpg"))
html_logo = logo_path

# favicon_path = os.path.abspath(os.path.join(basepath, "../../../client/public/favicon.ico"))
# html_favicon = favicon_path
