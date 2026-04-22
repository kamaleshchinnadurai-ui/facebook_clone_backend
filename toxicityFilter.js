const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.85; 
let model = null;

const loadModel = async () => {
    try {
        console.log('Loading TensorFlow Toxicity model...');
        model = await toxicity.load(threshold);
        console.log('✅ Toxicity model loaded successfully!');
    } catch (error) {
        console.error('Error loading model:', error);
    }
};

const checkToxicity = async (text) => {
    if (!model) {
        console.log("Model not ready yet, allowing text.");
        return false;
    }

    try {
        // AI runs the check
        const predictions = await model.classify([text]);
        
        // Find exactly which categories triggered the block
        let flaggedCategories = [];
        predictions.forEach(category => {
            if (category.results[0].match === true) {
                flaggedCategories.push(category.label);
            }
        });
        
        if (flaggedCategories.length > 0) {
            console.log(`🚩 AI BLOCKED POST: "${text}"`);
            console.log(`🚩 Reason: Flagged for ${flaggedCategories.join(', ')}`);
            return true;
        }

        console.log(`✅ AI PASSED POST: "${text}"`);
        return false;

    } catch (error) {
        console.error("❌ AI Checking Error:", error.message);
        return false; // If the AI crashes, let the post through so the app doesn't break
    }
};

module.exports = { loadModel, checkToxicity };