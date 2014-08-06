# Clean left over files compiled with "build" path
find build -name '*.pyc' -delete
python2.7 setup.py  install -O1 --skip-build --root=$RPM_BUILD_ROOT --record=INSTALLED_FILES
