export async function getInventory() {
   const response = await fetch('/api/get');
   
   return await response.json();
}

export async function checkInventory() {
   const response = await fetch('/api/check');
   return await response.json();
}

export async function sellItems() {
   const response = await fetch('/api/sell');
   return await response.json();
}