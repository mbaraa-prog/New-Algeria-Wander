from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Wrap all DRF errors in a consistent JSON envelope:
    {
        "success": false,
        "message": "...",
        "errors": { ... }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_data = response.data

        # Build human-readable message from the first error
        message = "An error occurred."
        if isinstance(error_data, dict):
            for key, value in error_data.items():
                first = value[0] if isinstance(value, list) else value
                if key == "detail":
                    message = str(first)
                else:
                    message = f"{key}: {first}"
                break
        elif isinstance(error_data, list) and error_data:
            message = str(error_data[0])

        response.data = {
            "success": False,
            "message": message,
            "errors": error_data,
        }

    return response
