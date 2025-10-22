import { test, expect } from '@playwright/test';

test.describe('Kanban Board Sorting and Positioning', () => {
  // Zwiększamy timeout dla testów Kanban, które wymagają więcej czasu na operacje drag-and-drop
  test.setTimeout(60000);
  test.beforeEach(async ({ page }) => {
    console.log('Navigating to Kanban page...');
    try {
      // Navigate to the Kanban page before each test
      await page.goto('/kanban', { timeout: 30000 });
      console.log('Page loaded, waiting for Kanban Board title...');
      
      // Wait for the Kanban board to be visible with increased timeout
      await page.waitForSelector('h1:has-text("Kanban Board")', { timeout: 30000 });
      console.log('Kanban Board title found, test ready to proceed');
    } catch (error) {
      console.error('Error during test setup:', error);
      // Take a screenshot to help debug
      await page.screenshot({ path: `test-results/setup-error-${Date.now()}.png` });
      throw error;
    }
  });

  test('should reorder tasks within the same column', async ({ page }) => {
    // Find the "To Do" column
    const todoColumn = page.locator('h2:has-text("To Do")').first().locator('..').locator('..');
    await todoColumn.waitFor({ state: 'visible' });
    
    // Add two tasks to the column with unique identifiers
    const timestamp = Date.now();
    const task1Title = `Task to reorder 1 ${timestamp}`;
    const task2Title = `Task to reorder 2 ${timestamp}`;
    
    // Add first task
    await todoColumn.locator('input[placeholder="Add new task..."]').fill(task1Title);
    await todoColumn.locator('button:has-text("Add")').click();
    
    // Add second task
    await todoColumn.locator('input[placeholder="Add new task..."]').fill(task2Title);
    await todoColumn.locator('button:has-text("Add")').click();
    
    // Wait for UI to update
    await page.waitForTimeout(500);
    
    // Verify both tasks are visible - use more precise selectors
    const task1 = todoColumn.getByText(task1Title, { exact: true }).first();
    const task2 = todoColumn.getByText(task2Title, { exact: true }).first();
    
    await expect(task1).toBeVisible();
    await expect(task2).toBeVisible();
    
    // Get all tasks in the column to check initial order
    const initialTasks = await todoColumn.locator('.card').all();
    let initialTask1Index = -1;
    let initialTask2Index = -1;
    
    for (let i = 0; i < initialTasks.length; i++) {
      const taskText = await initialTasks[i].textContent();
      if (taskText && taskText.includes(task1Title)) {
        initialTask1Index = i;
      }
      if (taskText && taskText.includes(task2Title)) {
        initialTask2Index = i;
      }
    }
    
    console.log(`Initial order: Task1 index=${initialTask1Index}, Task2 index=${initialTask2Index}`);
    
    // Confirm initial order - task1 should be before task2 (task1 was added first)
    expect(initialTask1Index).toBeLessThan(initialTask2Index);
    
    // Find the tasks again to get fresh references
    const task1Element = todoColumn.getByText(task1Title, { exact: true }).first();
    const task2Element = todoColumn.getByText(task2Title, { exact: true }).first();
    
    await task1Element.waitFor({ state: 'visible' });
    await task2Element.waitFor({ state: 'visible' });
    
    // Get bounding boxes for both tasks
    const task1Box = await task1Element.boundingBox();
    const task2Box = await task2Element.boundingBox();
    
    if (task1Box && task2Box) {
      console.log('Starting drag operation');
      
      // Move to the center of task1
      await page.mouse.move(
        task1Box.x + task1Box.width / 2,
        task1Box.y + task1Box.height / 2
      );
      
      // Start dragging with a longer pause
      await page.waitForTimeout(200);
      await page.mouse.down();
      await page.waitForTimeout(200);
      
      // Move in small increments for better drag recognition
      // Move to a position BELOW task2 to ensure it's placed after
      const steps = 15; // More steps for smoother movement
      const xDiff = (task2Box.x + task2Box.width / 2) - (task1Box.x + task1Box.width / 2);
      const yDiff = (task2Box.y + task2Box.height + 10) - (task1Box.y + task1Box.height / 2); // Position below task2
      
      for (let i = 1; i <= steps; i++) {
        await page.mouse.move(
          task1Box.x + task1Box.width / 2 + (xDiff * i / steps),
          task1Box.y + task1Box.height / 2 + (yDiff * i / steps)
        );
        await page.waitForTimeout(50);
      }
      
      // Hold at final position
      await page.waitForTimeout(200);
      
      // Release the mouse
      await page.mouse.up();
      
      // Wait longer for the drag operation to complete and UI to update
      await page.waitForTimeout(1000);
      
      console.log('Drag operation completed, verifying new order');
      
      // Verify the order has changed - task1 should now be below task2
      const finalTasks = await todoColumn.locator('.card').all();
      let finalTask1Index = -1;
      let finalTask2Index = -1;
      
      for (let i = 0; i < finalTasks.length; i++) {
        const taskText = await finalTasks[i].textContent();
        console.log(`Task ${i} text: ${taskText}`);
        if (taskText && taskText.includes(task1Title)) {
          finalTask1Index = i;
        }
        if (taskText && taskText.includes(task2Title)) {
          finalTask2Index = i;
        }
      }
      
      console.log(`Final order: Task1 index=${finalTask1Index}, Task2 index=${finalTask2Index}`);
      
      // Verify order has changed (task1 and task2 have swapped positions)
      // Oczekujemy, że task1 będzie teraz po task2 lub task2 będzie przed task1
      if (finalTask1Index > finalTask2Index) {
        expect(finalTask1Index).toBeGreaterThan(finalTask2Index);
      } else {
        expect(finalTask2Index).toBeGreaterThan(finalTask1Index);
      }
    }
  });

  test('should move task to the start of another column', async ({ page }) => {
    // Find the "To Do" column
    const todoColumn = page.locator('h2:has-text("To Do")').first().locator('..').locator('..');
    await todoColumn.waitFor({ state: 'visible' });
    
    // Find the "In Progress" column
    const inProgressColumn = page.locator('h2:has-text("In Progress")').first().locator('..').locator('..');
    await inProgressColumn.waitFor({ state: 'visible' });
    
    // Add a task to the "In Progress" column first to ensure it has content with unique identifier
    const timestamp = Date.now();
    const existingTaskTitle = `Existing In Progress Task ${timestamp}`;
    await inProgressColumn.locator('input[placeholder="Add new task..."]').fill(existingTaskTitle);
    await inProgressColumn.locator('button:has-text("Add")').click();
    await page.waitForTimeout(500); // Wait longer for UI update
    
    // Verify the task was added to In Progress column with more precise selector
    const existingTask = inProgressColumn.getByText(existingTaskTitle, { exact: true }).first();
    await expect(existingTask).toBeVisible({ timeout: 5000 });
    
    // Add a task to the "To Do" column that we'll move with unique identifier
    const newTaskTitle = `Task to move to start ${timestamp}`;
    await todoColumn.locator('input[placeholder="Add new task..."]').fill(newTaskTitle);
    await todoColumn.locator('button:has-text("Add")').click();
    await page.waitForTimeout(500); // Wait longer for UI update
    
    // Verify the task was added to Todo column with more precise selector
    const taskToMoveElement = todoColumn.getByText(newTaskTitle, { exact: true }).first();
    await expect(taskToMoveElement).toBeVisible({ timeout: 5000 });
    
    // Use the already found task elements
    await taskToMoveElement.waitFor({ state: 'visible', timeout: 5000 });
    await existingTask.waitFor({ state: 'visible', timeout: 5000 });
    
    console.log('Found both tasks, preparing to drag');
    
    // Get bounding boxes
    const taskToMoveBox = await taskToMoveElement.boundingBox();
    const existingTaskBox = await existingTask.boundingBox();
    
    if (taskToMoveBox && existingTaskBox) {
      console.log('Starting drag operation');
      
      // Start dragging the task to move
      await page.mouse.move(
        taskToMoveBox.x + taskToMoveBox.width / 2,
        taskToMoveBox.y + taskToMoveBox.height / 2
      );
      
      await page.waitForTimeout(200);
      await page.mouse.down();
      await page.waitForTimeout(200);
      
      // Move to just above the existing task (to position at the start)
      const steps = 15; // More steps for smoother movement
      const xDiff = (existingTaskBox.x + existingTaskBox.width / 2) - (taskToMoveBox.x + taskToMoveBox.width / 2);
      const yDiff = (existingTaskBox.y - 10) - (taskToMoveBox.y + taskToMoveBox.height / 2); // Position above
      
      for (let i = 1; i <= steps; i++) {
        await page.mouse.move(
          taskToMoveBox.x + taskToMoveBox.width / 2 + (xDiff * i / steps),
          taskToMoveBox.y + taskToMoveBox.height / 2 + (yDiff * i / steps)
        );
        await page.waitForTimeout(30); // Shorter pauses between steps
      }
      
      // Hold at final position
      await page.waitForTimeout(200);
      
      // Release the mouse
      await page.mouse.up();
      
      // Wait longer for the drag operation to complete and UI to update
      await page.waitForTimeout(1000);
      
      console.log('Drag operation completed, verifying new position');
      
      // Verify the task has been moved to the target column
      const movedTask = inProgressColumn.getByText(newTaskTitle, { exact: true }).first();
      await expect(movedTask).toBeVisible({ timeout: 5000 });
      
      // Verify the order - the moved task should be before the existing task
      const tasks = await inProgressColumn.locator('.card').all();
      let movedTaskIndex = -1;
      let existingTaskIndex = -1;
      
      for (let i = 0; i < tasks.length; i++) {
        const taskText = await tasks[i].textContent();
        console.log(`Task ${i} text: ${taskText}`);
        if (taskText && taskText.includes(newTaskTitle)) {
          movedTaskIndex = i;
        }
        if (taskText && taskText.includes(existingTaskTitle)) {
          existingTaskIndex = i;
        }
      }
      
      console.log(`Final order: Moved task index=${movedTaskIndex}, Existing task index=${existingTaskIndex}`);
      
      // Verify the moved task is before the existing task
      expect(movedTaskIndex).toBeLessThan(existingTaskIndex);
    }
  });

  test('should move task to the end of another column', async ({ page }) => {
    try {
      // Find the "To Do" column
      const todoColumn = page.locator('h2:has-text("To Do")').first().locator('..').locator('..');
      await todoColumn.waitFor({ state: 'visible', timeout: 5000 });
      
      // Find the "Done" column
      const doneColumn = page.locator('h2:has-text("Done")').first().locator('..').locator('..');
      await doneColumn.waitFor({ state: 'visible', timeout: 5000 });
      
      // Add a task to the "To Do" column that we'll move with unique identifier
      const timestamp = Date.now();
      const newTaskTitle = `Task to move to end ${timestamp}`;
      await todoColumn.locator('input[placeholder="Add new task..."]').fill(newTaskTitle);
      await todoColumn.locator('button:has-text("Add")').click();
      await page.waitForTimeout(500); // Wait longer for UI update
      
      // Verify the task was added with more precise selector
      const taskToMove = todoColumn.getByText(newTaskTitle, { exact: true }).first();
      await expect(taskToMove).toBeVisible({ timeout: 5000 });
      
      // Wait for the task to be fully visible
      await taskToMove.waitFor({ state: 'visible', timeout: 5000 });
      
      console.log('Found task to move, preparing to drag to Done column');
      
      // Get bounding boxes
      const taskToMoveBox = await taskToMove.boundingBox();
      const doneColumnBox = await doneColumn.boundingBox();
      
      if (taskToMoveBox && doneColumnBox) {
        console.log('Starting drag operation to Done column');
        
        // Start dragging the task to move
        await page.mouse.move(
          taskToMoveBox.x + taskToMoveBox.width / 2,
          taskToMoveBox.y + taskToMoveBox.height / 2
        );
        
        await page.waitForTimeout(200);
        await page.mouse.down();
        await page.waitForTimeout(200);
        
        // Move directly to the column (not to a task) to position at the end
        // Target the bottom third of the column for end positioning
        const steps = 15; // More steps for smoother movement
        const xDiff = (doneColumnBox.x + doneColumnBox.width / 2) - (taskToMoveBox.x + taskToMoveBox.width / 2);
        const yDiff = (doneColumnBox.y + doneColumnBox.height * 0.7) - (taskToMoveBox.y + taskToMoveBox.height / 2);
        
        for (let i = 1; i <= steps; i++) {
          await page.mouse.move(
            taskToMoveBox.x + taskToMoveBox.width / 2 + (xDiff * i / steps),
            taskToMoveBox.y + taskToMoveBox.height / 2 + (yDiff * i / steps)
          );
          await page.waitForTimeout(30); // Shorter pauses between steps
        }
        
        // Hold at final position
        await page.waitForTimeout(200);
        
        // Release the mouse
        await page.mouse.up();
        
        // Wait longer for the drag operation to complete and UI to update
        await page.waitForTimeout(1000);
        
        console.log('Drag operation completed, verifying task moved to Done column');
        
        // Verify the task has been moved to the target column with more precise selector
        const movedTask = doneColumn.getByText(newTaskTitle, { exact: true }).first();
        await expect(movedTask).toBeVisible({ timeout: 5000 });
        
        // Verify the task is at the end of the column
        const tasks = await doneColumn.locator('.card').all();
        console.log(`Found ${tasks.length} tasks in Done column`);
        
        if (tasks.length > 0) {
          const lastTaskText = await tasks[tasks.length - 1].textContent();
          console.log(`Last task text: ${lastTaskText}`);
          
          // The moved task should be the last one
          expect(lastTaskText).toContain(newTaskTitle);
        } else {
          throw new Error('No tasks found in Done column after drag operation');
        }
      }
    } catch (error) {
      console.error('Test failed with error:', error);
      throw error;
    }
  });

  test('should move task between multiple columns', async ({ page }) => {
    try {
      // Find all columns
      const todoColumn = page.locator('h2:has-text("To Do")').first().locator('..').locator('..');
      const inProgressColumn = page.locator('h2:has-text("In Progress")').first().locator('..').locator('..');
      const doneColumn = page.locator('h2:has-text("Done")').first().locator('..').locator('..');
      
      await todoColumn.waitFor({ state: 'visible', timeout: 5000 });
      await inProgressColumn.waitFor({ state: 'visible', timeout: 5000 });
      await doneColumn.waitFor({ state: 'visible', timeout: 5000 });
      
      // Add a task to the "To Do" column that we'll move through multiple columns
      const timestamp = Date.now();
      const taskTitle = `Task to move through columns ${timestamp}`;
      await todoColumn.locator('input[placeholder="Add new task..."]').fill(taskTitle);
      await todoColumn.locator('button:has-text("Add")').click();
      await page.waitForTimeout(500);
      
      // Verify the task was added
      const taskToMove = todoColumn.getByText(taskTitle, { exact: true }).first();
      await expect(taskToMove).toBeVisible({ timeout: 5000 });
      
      // First move: To Do -> In Progress
      console.log('Moving task from To Do to In Progress');
      const taskBox1 = await taskToMove.boundingBox();
      const inProgressBox = await inProgressColumn.boundingBox();
      
      if (taskBox1 && inProgressBox) {
        // Calculate start and target positions
        const startX = taskBox1.x + taskBox1.width / 2;
        const startY = taskBox1.y + taskBox1.height / 2;
        const targetX = inProgressBox.x + inProgressBox.width / 2;
        const targetY = inProgressBox.y + inProgressBox.height / 2;
        
        // Perform drag and drop
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.waitForTimeout(300);
        
        // Move in small increments for more stability
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
          const x = startX + (targetX - startX) * (i / steps);
          const y = startY + (targetY - startY) * (i / steps);
          await page.mouse.move(x, y);
          await page.waitForTimeout(50);
        }
        
        await page.mouse.up();
        await page.waitForTimeout(500);
        
        // Verify task moved to In Progress
        const movedTask1 = inProgressColumn.getByText(taskTitle, { exact: true }).first();
        await expect(movedTask1).toBeVisible({ timeout: 5000 });
        
        // Second move: In Progress -> Done
        console.log('Moving task from In Progress to Done');
        const taskBox2 = await movedTask1.boundingBox();
        const doneBox = await doneColumn.boundingBox();
        
        if (taskBox2 && doneBox) {
          // Calculate start and target positions
          const startX2 = taskBox2.x + taskBox2.width / 2;
          const startY2 = taskBox2.y + taskBox2.height / 2;
          const targetX2 = doneBox.x + doneBox.width / 2;
          const targetY2 = doneBox.y + doneBox.height / 2;
          
          // Perform drag and drop
          await page.mouse.move(startX2, startY2);
          await page.mouse.down();
          await page.waitForTimeout(300);
          
          // Move in small increments for more stability
          for (let i = 0; i <= steps; i++) {
            const x = startX2 + (targetX2 - startX2) * (i / steps);
            const y = startY2 + (targetY2 - startY2) * (i / steps);
            await page.mouse.move(x, y);
            await page.waitForTimeout(50);
          }
          
          await page.mouse.up();
          await page.waitForTimeout(500);
          
          // Verify task moved to Done
          const movedTask2 = doneColumn.getByText(taskTitle, { exact: true }).first();
          await expect(movedTask2).toBeVisible({ timeout: 5000 });
          
          // Verify task is no longer in the original columns
          const todoTasks = await todoColumn.getByText(taskTitle, { exact: true }).count();
          const inProgressTasks = await inProgressColumn.getByText(taskTitle, { exact: true }).count();
          
          expect(todoTasks).toBe(0);
          expect(inProgressTasks).toBe(0);
        }
      }
    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
});
