# dnd-kit Cross-Container Drag and Drop Implementation Experience

## Overview

This document captures our experience implementing proper ghost/placeholder functionality for cross-container dragging in a Kanban board using dnd-kit. The goal was to improve the user experience by showing the same ghost/placeholder for cross-container dragging as for intra-column dragging, and to enable dropping items at the start, middle, and end of columns.

## Key Challenges and Solutions

### 1. Custom Drop Indicators vs. Native Placeholder

**Challenge:** The initial implementation used custom drop indicators (bars/lines) for cross-container dragging, which created an inconsistent UX compared to intra-column dragging.

**Solution:** We removed all custom drop indicators and refactored the code to use dnd-kit's native placeholder/ghost functionality for both intra-column and cross-container dragging.

```typescript
// Before: Custom drop indicators
<div className="drop-indicator-top" data-testid="drop-indicator-top" />

// After: Using dnd-kit's native placeholder via SortableContext
<SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
  {items.map(item => (
    <SortableItem key={item.id} item={item} />
  ))}
</SortableContext>
```

### 2. Proper Collision Detection

**Challenge:** Default collision detection didn't provide optimal UX for cross-container dragging, especially for dropping at the start or end of columns.

**Solution:** We implemented a custom collision detection strategy that prioritizes pointer position for better UX:

```typescript
const collisionDetectionStrategy: CollisionDetection = useCallback(
  (args) => {
    // First, detect collisions with pointer
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    
    // Fall back to rect intersection for better coverage
    return rectIntersection(args);
  },
  []
);
```

### 3. Immediate State Updates During Drag

**Challenge:** The ghost/placeholder wasn't updating correctly during cross-container dragging because state updates were delayed until drag end.

**Solution:** We updated the items state immediately during drag over events to ensure the placeholder appears in the correct position:

```typescript
function handleDragOver(event: DragOverEvent) {
  const { active, over } = event;
  
  if (over && active.id !== over.id) {
    const activeContainer = findContainerOfItem(active.id);
    const overContainer = findContainerOfItem(over.id);
    
    if (activeContainer !== overContainer) {
      setItems(items => {
        // Move the item to the new container immediately
        // This ensures the placeholder appears correctly
        return moveItemToContainer(items, active.id, overContainer, over.id);
      });
    }
  }
}
```

### 4. Styling for Better Visual Feedback

**Challenge:** The dragged item and placeholder needed better visual styling to provide clear feedback during dragging.

**Solution:** We enhanced the styling of items during drag to improve visual feedback:

```typescript
// In SortableItem component
const { isDragging } = useSortable({ id: item.id });

return (
  <div 
    className={`sortable-item ${isDragging ? 'opacity-50 border-dashed' : ''}`}
    style={{
      transform: CSS.Transform.toString(transform),
      transition,
    }}
  >
    {item.content}
  </div>
);
```

## Testing Challenges

1. **Test Refactoring:** We had to update test files to match the new component interfaces after removing unused props.

2. **Ghost Verification:** Testing the visual appearance of ghosts/placeholders required special mocking of dnd-kit hooks.

3. **Cross-Container Tests:** We needed to simulate complex drag operations between containers to verify the UX improvements.

## Best Practices Learned

1. **Use Native dnd-kit Features:** Leverage dnd-kit's built-in placeholder/ghost functionality rather than implementing custom indicators.

2. **Immediate State Updates:** Update state during drag operations for responsive feedback, not just at drag end.

3. **Custom Collision Detection:** Combine multiple collision detection strategies for optimal UX.

4. **Consistent Visual Feedback:** Maintain consistent visual feedback between intra-column and cross-container dragging.

5. **Clean Component Props:** Only pass necessary props to components; remove unused props to reduce complexity.

## Next Steps

1. Complete regression and unit tests for cross-container drag/drop UX.
2. Verify keyboard navigation works correctly with the new implementation.
3. Optimize performance for large boards with many items.
4. Add accessibility improvements for screen readers.

## References

- [dnd-kit Documentation](https://docs.dndkit.com/)
- [dnd-kit Sortable Preset](https://docs.dndkit.com/presets/sortable)
- [Multiple Containers Example](https://docs.dndkit.com/examples/sortable/multiple-containers)
