from PIL import Image

def make_transparent(input_path, output_path, color_to_remove):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel color matches the color to remove (with a small threshold)
        r, g, b, a = item
        if color_to_remove == "white":
            if r > 240 and g > 240 and b > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        elif color_to_remove == "black":
            if r < 15 and g < 15 and b < 15:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

# For ITL - remove black background
make_transparent("public/itl-logo-v2.png", "public/itl-logo-v2-transparent.png", "black")
