## https://cloudinary.com/cookbook/resizing_an_image_to_fill_given_dimensions
## https://cloudinary.com/cookbook/face_detection_based_image_cropping
import cloudinary
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url



DEFAULT_TAG = "python_sample"


def dump_response(response):
    print("Upload response:")
    for key in sorted(response.keys()):
        print("  %s: %s" % (key, response[key]))

url,options = cloudinary.utils.cloudinary_url("sample.jpg",
                                width = 100,
                                height = 150,
                                crop = "scale")

print ( url)

## upload an image
print("--- Upload a local file with custom public ID")
response = upload(
    "static\\img\\47.jpg",
    tags=DEFAULT_TAG,
    public_id="custom_name",
    folder="avaniyoga"
)
dump_response(response)
url, options = cloudinary_url(
    response['public_id'],
    format=response['format'],
    width=200,
    height=150,
    secure=True,
    crop="fit"
)
print("Fit into 200x150 url: " + url)
print("")
