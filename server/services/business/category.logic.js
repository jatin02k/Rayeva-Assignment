export function validateCategoryInput(name,description){
    if(!name||name.trim().length<2){
        throw new Error("Category name must be at least 2 characters long");
    }
    if(!description||description.trim().length<10){
        throw new Error("Category description must be at least 10 characters long");
    }
    if(description&&description.trim().length>1000){
        throw new Error("Category description must be at most 1000 characters long");
    }
};

export function enrichCategoryResult(aiResult, productName){
    return {
        ...aiResult,
        product_name:productName,
        seo_tags:aiResult.seo_tags?.slice(0,10),
        processedAt:new Date().toISOString(),
        
    }
}
    