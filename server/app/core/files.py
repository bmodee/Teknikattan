"""
Contains functions related to file handling, mainly saving and deleting images.
"""

from PIL import Image
from flask import current_app, has_app_context
import os
from flask_uploads import IMAGES, UploadSet

if has_app_context():
    PHOTO_PATH = current_app.config["UPLOADED_PHOTOS_DEST"]
    THUMBNAIL_SIZE = current_app.config["THUMBNAIL_SIZE"]
    image_set = UploadSet("photos", IMAGES)


# def compare_images(input_image, output_image):
#     # compare image dimensions (assumption 1)
#     if input_image.size != output_image.size:
#         return False

#     rows, cols = input_image.size

#     # compare image pixels (assumption 2 and 3)
#     for row in range(rows):
#         for col in range(cols):
#             input_pixel = input_image.getpixel((row, col))
#             output_pixel = output_image.getpixel((row, col))
#             if input_pixel != output_pixel:
#                 return False

#     return True


def _delete_image(filename):
    path = os.path.join(PHOTO_PATH, filename)
    os.remove(path)


def save_image_with_thumbnail(image_file):
    """
    Saves the given image and also creates a small thumbnail for it.
    """

    saved_filename = image_set.save(image_file)
    saved_path = os.path.join(PHOTO_PATH, saved_filename)
    with Image.open(saved_path) as im:
        im_thumbnail = im.copy()
        im_thumbnail.thumbnail(THUMBNAIL_SIZE)
        thumb_path = os.path.join(PHOTO_PATH, f"thumbnail_{saved_filename}")
        im_thumbnail.save(thumb_path)
        im.close()
        return saved_filename


def delete_image_and_thumbnail(filename):
    """
    Delete the given image together with its thumbnail.
    """
    _delete_image(filename)
    _delete_image(f"thumbnail_{filename}")


"""
def _resolve_name_conflict(filename):
    split = os.path.splitext(filename)
    suffix = split[0]
    preffix = split[1]
    now = datetime.datetime.now()
    time_stamp = now.strftime("%Y%m%d%H%M%S")
    return f"{suffix}-{time_stamp}{preffix}"
"""
"""
def save_image_with_thumbnail(image_file):
    filename = image_file.filename
    path = os.path.join(PHOTO_PATH, filename)

    saved_filename = image_set.save(image_file)
    saved_path = os.path.join(PHOTO_PATH, saved_filename)
    im = Image.open(saved_path)

    # Check if image already exists
    if path != saved_path:
        im_existing = Image.open(path)
        # If both images are identical, then return None
        if compare_images(im, im_existing):
            im.close()
            im_existing.close()
            _delete_image(saved_filename)
            return filename

    path = os.path.join(PHOTO_PATH, saved_filename)
    im_thumbnail = im.copy()
    im_thumbnail.thumbnail(THUMBNAIL_SIZE)

    thumb_path = os.path.join(PHOTO_PATH, f"thumbnail_{saved_filename}")
    im_thumbnail.save(thumb_path)
    im.close()
    return saved_filename
"""
