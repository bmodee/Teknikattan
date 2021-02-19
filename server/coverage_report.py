import xml.etree.ElementTree as et

tree = et.parse('coverage.xml')
root = tree.getroot()
for package in tree.find('.//packages'):
  package.set('name', 'server.' + package.attrib.get('name'))
  for package_class in package.find('classes'):
    package_class.set('name', 'server.' + package_class.attrib.get('name'))
    package_class.set('filename', 'server/' + package_class.attrib.get('filename'))
tree.write('coverage.xml')
