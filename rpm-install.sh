# Clean left over files compiled with "build" path
find build -name '*.pyc' -delete
python2.7 setup.py  install -O1 --skip-build --root %{buildroot} --record INSTALLED_FILES
# Exclude compiled namespace files to avoid conflict with wonder-common.
# XXX Should really install somewhere else and fix with pth!
sed -e '/wonder\/__init__.py[oc]/d' -i INSTALLED_FILES
rm %{buildroot}%{python_sitelib}/wonder/__init__.py[oc]
