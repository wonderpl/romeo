from flask import Blueprint, render_template, request, jsonify


paymentsapp = Blueprint('payments', __name__, url_prefix='/payments')


@paymentsapp.route('/', methods=('GET', 'POST',))
def payments():
    if request.method == 'POST':
        return jsonify(request.form)
    return render_template('payments/index.html')
