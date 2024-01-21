import os
import shutil
import random

def move_files(src_img_dir, src_label_dir, dest_img_dir, dest_label_dir, percentage):
    if not os.path.exists(dest_img_dir):
        os.makedirs(dest_img_dir)
    if not os.path.exists(dest_label_dir):
        os.makedirs(dest_label_dir)

    classes = set()
    for filename in os.listdir(src_img_dir):
        if filename.endswith(".jpg"):
            class_name = filename.split('_')[0]  # Assumes class name is the first part of the filename
            classes.add(class_name)

    for cls in classes:
        cls_files = [f for f in os.listdir(src_img_dir) if f.startswith(cls)]
        num_to_move = max(1, int(len(cls_files) * percentage))  # At least 1 file
        selected_files = random.sample(cls_files, num_to_move)
        for file in selected_files:
            shutil.move(os.path.join(src_img_dir, file), dest_img_dir)
            label_file = file.split('.')[0] + '.xml'  # Assumes label files have same name but with .xml extension
            shutil.move(os.path.join(src_label_dir, label_file), dest_label_dir)

# Example usage
src_img_dir = './train_images'
src_label_dir = './train_labels'
dest_img_dir = './half_train_images'
dest_label_dir = './half_train_labels'

move_files(src_img_dir, src_label_dir, dest_img_dir, dest_label_dir, 0.5)  # Move 5% of each class