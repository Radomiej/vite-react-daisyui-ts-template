import { test, expect } from '@playwright/test';

test.describe('Kanban Board Basic Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Kanban page before each test
    await page.goto('/kanban');
    // Wait for the Kanban board to be visible
    await page.waitForSelector('h1:has-text("Kanban Board")');
  });

  test('should display initial columns and tasks', async ({ page }) => {
    // Check if the initial columns are displayed
    await expect(page.locator('text="To Do"').first()).toBeVisible();
    await expect(page.locator('text="In Progress"').first()).toBeVisible();
    await expect(page.locator('text="Done"').first()).toBeVisible();
    
    // Check if the initial tasks are displayed
    await expect(page.locator('text="Research dnd-kit"').first()).toBeVisible();
    await expect(page.locator('text="Design Kanban structure"').first()).toBeVisible();
    await expect(page.locator('text="Implement drag and drop"').first()).toBeVisible();
    await expect(page.locator('text="Set up project structure"').first()).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Find the "To Do" column
    const todoColumn = page.locator('h2:has-text("To Do")').first().locator('..').locator('..');
    
    // Type a new task title
    const newTaskTitle = 'New Test Task';
    await todoColumn.locator('input[placeholder="Add new task..."]').fill(newTaskTitle);
    
    // Click the Add button
    await todoColumn.locator('button:has-text("Add")').click();
    
    // Verify the new task is added
    await expect(page.locator(`text="${newTaskTitle}"`).first()).toBeVisible();
  });

  test('should create a new column', async ({ page }) => {
    // Type a new column title
    const newColumnTitle = 'New Test Column';
    await page.locator('input[placeholder="Add new column..."]').fill(newColumnTitle);
    
    // Click the Add Column button
    await page.locator('button:has-text("Add Column")').click();
    
    // Verify the new column is added
    await expect(page.locator(`h2:has-text("${newColumnTitle}")`).first()).toBeVisible();
  });

  test('should drag and drop a task between columns', async ({ page }) => {
    // Find the source task
    const sourceTask = page.locator('text="Research dnd-kit"').first();
    await sourceTask.waitFor({ state: 'visible' });
    
    // Find the target column (In Progress)
    const targetColumn = page.locator('h2:has-text("In Progress")').first().locator('..').locator('..');
    await targetColumn.waitFor({ state: 'visible' });
    
    // Perform drag and drop with improved reliability
    const sourceTaskBoundingBox = await sourceTask.boundingBox();
    const targetColumnBoundingBox = await targetColumn.boundingBox();
    
    if (sourceTaskBoundingBox && targetColumnBoundingBox) {
      // Start dragging from the center of the source task
      await page.mouse.move(
        sourceTaskBoundingBox.x + sourceTaskBoundingBox.width / 2,
        sourceTaskBoundingBox.y + sourceTaskBoundingBox.height / 2
      );
      
      // Make sure we're hovering over the element before clicking
      await page.waitForTimeout(100);
      await page.mouse.down();
      
      // Move in small increments for better drag recognition
      const steps = 10;
      const xDiff = (targetColumnBoundingBox.x + targetColumnBoundingBox.width / 2) - (sourceTaskBoundingBox.x + sourceTaskBoundingBox.width / 2);
      const yDiff = (targetColumnBoundingBox.y + targetColumnBoundingBox.height / 2) - (sourceTaskBoundingBox.y + sourceTaskBoundingBox.height / 2);
      
      for (let i = 1; i <= steps; i++) {
        await page.mouse.move(
          sourceTaskBoundingBox.x + sourceTaskBoundingBox.width / 2 + (xDiff * i / steps),
          sourceTaskBoundingBox.y + sourceTaskBoundingBox.height / 2 + (yDiff * i / steps)
        );
        await page.waitForTimeout(50);
      }
      
      // Pause briefly before releasing
      await page.waitForTimeout(100);
      await page.mouse.up();
      
      // Wait for the drag operation to complete and UI to update
      await page.waitForTimeout(500);
      
      // Verify the task is now in the target column
      const inProgressColumn = page.locator('h2:has-text("In Progress")').first().locator('..').locator('..');
      await expect(inProgressColumn.locator('text="Research dnd-kit"')).toBeVisible({ timeout: 10000 });
    }
  });

  test('should handle edge case: empty column', async ({ page }) => {
    // Find the "To Do" column
    const todoColumn = page.locator('h2:has-text("To Do")').first().locator('..').locator('..');
    await todoColumn.waitFor({ state: 'visible' });
    
    // Find all tasks in the To Do column
    const tasks = todoColumn.locator('.card');
    const count = await tasks.count();
    console.log(`Found ${count} tasks in the To Do column`);
    
    // Drag all tasks to another column (In Progress)
    const targetColumn = page.locator('h2:has-text("In Progress")').first().locator('..').locator('..');
    await targetColumn.waitFor({ state: 'visible' });
    const targetColumnBoundingBox = await targetColumn.boundingBox();
    
    if (targetColumnBoundingBox) {
      // Iterate through each task
      for (let i = 0; i < count; i++) {
        console.log(`Moving task ${i + 1} of ${count}`);
        
        // Always get the first task since they'll shift after each move
        const task = todoColumn.locator('.card').first();
        await task.waitFor({ state: 'visible', timeout: 5000 });
        const taskBoundingBox = await task.boundingBox();
        
        if (taskBoundingBox) {
          // Drag and drop with improved reliability
          await page.mouse.move(
            taskBoundingBox.x + taskBoundingBox.width / 2,
            taskBoundingBox.y + taskBoundingBox.height / 2
          );
          
          // Make sure we're hovering over the element before clicking
          await page.waitForTimeout(100);
          await page.mouse.down();
          
          // Move in small increments for better drag recognition
          const steps = 10;
          const xDiff = (targetColumnBoundingBox.x + targetColumnBoundingBox.width / 2) - (taskBoundingBox.x + taskBoundingBox.width / 2);
          const yDiff = (targetColumnBoundingBox.y + targetColumnBoundingBox.height / 2) - (taskBoundingBox.y + taskBoundingBox.height / 2);
          
          for (let j = 1; j <= steps; j++) {
            await page.mouse.move(
              taskBoundingBox.x + taskBoundingBox.width / 2 + (xDiff * j / steps),
              taskBoundingBox.y + taskBoundingBox.height / 2 + (yDiff * j / steps)
            );
            await page.waitForTimeout(50);
          }
          
          // Pause briefly before releasing
          await page.waitForTimeout(100);
          await page.mouse.up();
          
          // Wait for the drag operation to complete and UI to update
          await page.waitForTimeout(500);
        }
      }
      
      // Verify the To Do column is empty (should still exist but have no tasks)
      await expect(todoColumn).toBeVisible();
      
      // Wait a bit longer and retry if needed
      try {
        await expect(todoColumn.locator('.card')).toHaveCount(0, { timeout: 10000 });
      } catch (e) {
        // Log the current count for debugging
        const remainingCount = await todoColumn.locator('.card').count();
        console.log(`Failed: ${remainingCount} tasks still in the To Do column`);
        
        // Try one more time with the remaining cards if any
        if (remainingCount > 0) {
          for (let i = 0; i < remainingCount; i++) {
            const task = todoColumn.locator('.card').first();
            const taskBB = await task.boundingBox();
            const targetBB = await targetColumn.boundingBox();
            
            if (taskBB && targetBB) {
              // One more attempt to drag and drop
              await page.mouse.move(taskBB.x + taskBB.width/2, taskBB.y + taskBB.height/2);
              await page.waitForTimeout(100);
              await page.mouse.down();
              await page.mouse.move(targetBB.x + targetBB.width/2, targetBB.y + targetBB.height/2, { steps: 10 });
              await page.waitForTimeout(100);
              await page.mouse.up();
              await page.waitForTimeout(500);
            }
          }
          
          // Final verification
          await expect(todoColumn.locator('.card')).toHaveCount(0, { timeout: 5000 });
        }
      }
    }
  });

  test('should handle failure case: invalid drag operation', async ({ page }) => {
    // Try to drag the column header (which should not be draggable)
    const columnHeader = page.locator('h2:has-text("To Do")').first();
    const targetArea = page.locator('h2:has-text("In Progress")').first();
    
    const columnHeaderBoundingBox = await columnHeader.boundingBox();
    const targetAreaBoundingBox = await targetArea.boundingBox();
    
    if (columnHeaderBoundingBox && targetAreaBoundingBox) {
      // Attempt to drag the column header
      await page.mouse.move(
        columnHeaderBoundingBox.x + columnHeaderBoundingBox.width / 2,
        columnHeaderBoundingBox.y + columnHeaderBoundingBox.height / 2
      );
      await page.mouse.down();
      
      await page.mouse.move(
        targetAreaBoundingBox.x + targetAreaBoundingBox.width / 2,
        targetAreaBoundingBox.y + targetAreaBoundingBox.height / 2
      );
      
      await page.mouse.up();
      
      // Verify the column header is still in its original position
      await expect(page.locator('h2:has-text("To Do")').first()).toBeVisible();
      
      // The column structure should remain unchanged
      await expect(page.locator('h2').nth(0)).toHaveText('To Do');
      await expect(page.locator('h2').nth(1)).toHaveText('In Progress');
      await expect(page.locator('h2').nth(2)).toHaveText('Done');
    }
  });
});
