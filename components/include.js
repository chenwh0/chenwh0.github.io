document.querySelectorAll("[data-include]").forEach(async element => {
    const file = element.getAttribute("data-include");
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error("Failed to load " + file);
        element.innerHTML = await response.text();   
    }
    catch (error) {
        console.error(error);
        element.innerHTML = "";
    }
})