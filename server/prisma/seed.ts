import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  // Map the file names to model names in proper order
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  // Handle models with foreign key constraints first, in reverse order
  const deleteOrder = [
    "Sales", // Assuming Sales depends on Products
    "Products", // Product needs to be deleted after Sales
    "ExpenseSummary",
    "SalesSummary",
    "Purchases",
    "PurchaseSummary",
    "Users",
    "Expenses",
    "ExpenseByCategory",
  ];

  for (const modelName of deleteOrder) {
    const model: any = prisma[modelName as keyof typeof prisma];
    if (model) {
      try {
        // Delete all related records before deleting the main model
        await model.deleteMany({});
        console.log(`Cleared data from ${modelName}`);
      } catch (error) {
        console.error(`Failed to delete data from ${modelName}:`, error);
      }
    } else {
      console.error(
        `Model ${modelName} not found. Please ensure the model name is correctly specified.`
      );
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "products.json",
    "expenseSummary.json",
    "sales.json",
    "salesSummary.json",
    "purchases.json",
    "purchaseSummary.json",
    "users.json",
    "expenses.json",
    "expenseByCategory.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });