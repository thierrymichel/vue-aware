# NOTES

## directive

- `inserted`
- `update`
- `unbind`

---

## core

1. Register events (scroll, appear, viewport, resize, …)
2. Add on `inserted`
   - get/check callback option availability
3. Remove on `unbind`
4. Update/Add/Remove on `update`
   - based on callback option change

### `eventNames`

List of registered events.

### `elementsByEventName`

Elements (set) by event.

### `managerByEventName`

Manager (unique) by event.

---

## manager

### `name`

Event name for the manager.

### `optionsByElement`

Options object accessible by element.
