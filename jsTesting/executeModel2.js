const ort = require('onnxruntime-node');
const sharp = require('sharp');
const fs = require('fs');

async function main() {
    try {
        const imagePath = "testImage.jpg";
        const modelPath = "../fasterrcnn-pytorch-training-pipeline/weights/model.onnx";
        const resizeTo = 640; // Adjust as per your model's input requirement

        // Load and preprocess the image
        const imageBuffer = fs.readFileSync(imagePath);
        let processedImage = await sharp(imageBuffer)
            .resize(resizeTo, resizeTo, { fit: 'fill' })
            .raw()
            .toBuffer();

        // Convert the buffer to a Float32Array
        let imageData = Float32Array.from(processedImage);

        // Ensure the tensor shape matches the model's expected input
        // Adjust the shape [1, 3, height, width] as per your model's requirement
        const tensorInput = new ort.Tensor('float32', imageData, [1, 3, resizeTo, resizeTo]);
        
        // After processing the image and before creating the tensor
        console.log('Processed Image Size:', processedImage.length);  // Should match 640 * 640 * 3 if resizeTo is 640

        // After creating the tensor
        console.log('Tensor Shape:', tensorInput.dims);  // Should output [1, 3, 640, 640] if resizeTo is 640

        // Load the ONNX model
        const session = await ort.InferenceSession.create(modelPath);

        // Run the model
        const feeds = { [session.inputNames[0]]: tensorInput };
        const results = await session.run(feeds);

        // Handle the results (this will depend on your model's output)
        // Example: assuming a single output
        const output = results[session.outputNames[0]];
        console.log(output.data);

        // Post-process and display/save results (depends on your model and application)

    } catch (e) {
        console.error(`Error during inference: ${e}`);
    }
}

main();
