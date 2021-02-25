import xml.etree.ElementTree as et

tree = et.parse("output/coverage/jest/cobertura-coverage.xml")
root = tree.getroot()
for package in tree.find(".//packages"):
    package.set("name", "client." + package.attrib.get("name"))
    for package_class in package.find("classes"):
        package_class.set("name", "client." + package_class.attrib.get("name"))
        package_class.set("filename", "client/" + package_class.attrib.get("filename"))
tree.write("output/coverage/jest/cobertura-coverage.xml")
