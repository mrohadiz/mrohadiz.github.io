---
layout: article
title: "Event-Driven Architecture: Patterns and Practices"
image: /assets/images/og/2024-12-25-event-driven-architecture.png
date: 2024-12-25
last_modified_at: 2024-12-25
categories:
  - Software Architecture
tags:
  - event-driven
  - microservices
  - architecture
  - patterns
excerpt: "Panduan praktis untuk implementasi event-driven architecture dalam sistem modern."
---

Event-driven architecture (EDA) adalah pola desain di mana komponen sistem berkomunikasi melalui events. Pola ini menjadi semakin populer seiring dengan pertumbuhan microservices dan distributed systems.

## Mengapa Event-Driven?

1. **Decoupling**: Producer dan consumer tidak perlu tahu satu sama lain
2. **Scalability**: Events bisa diproses secara paralel
3. **Flexibility**: Mudah menambah consumer baru
4. **Auditability**: Setiap event terdokumentasi

## Core Patterns

### Event Notification
Producer mengirim notification bahwa sesuatu telah terjadi:

```python
# Simple event notification
class OrderService:
    def __init__(self, event_bus):
        self.event_bus = event_bus
    
    def create_order(self, order_data):
        order = Order.create(order_data)
        
        # Notify other services
        self.event_bus.publish("order.created", {
            "order_id": order.id,
            "customer_id": order.customer_id,
            "total": order.total
        })
        
        return order
```

### Event Sourcing
Menyimpan state sebagai sequence events:

```python
class EventStore:
    def __init__(self):
        self.events = []
    
    def append(self, event):
        self.events.append({
            "id": len(self.events) + 1,
            "type": event.type,
            "data": event.data,
            "timestamp": datetime.utcnow()
        })
    
    def get_events(self, aggregate_id):
        return [e for e in self.events 
                if e["data"].get("aggregate_id") == aggregate_id]
    
    def rebuild_state(self, aggregate_id):
        events = self.get_events(aggregate_id)
        state = {}
        for event in events:
            state = self.apply_event(state, event)
        return state
```

### CQRS (Command Query Responsibility Segregation)
Memisahkan read dan write models:

| Component | Responsibility |
|-----------|---------------|
| Command Side | Handle writes, validate, emit events |
| Query Side | Handle reads, optimized for queries |
| Event Store | Source of truth, stores all events |
| Read Store | Materialized views for queries |

## Implementation Considerations

### Event Schema Evolution
```json
{
  "version": "2.0",
  "event_type": "order.created",
  "timestamp": "2024-12-25T10:00:00Z",
  "data": {
    "order_id": "12345",
    "customer_id": "cust_001",
    "items": [...],
    "total": 99.99,
    "currency": "USD"
  }
}
```

### Error Handling
- Dead letter queues untuk events yang gagal diproses
- Idempotency keys untuk menghindari duplicate processing
- Circuit breaker untuk external service calls

## Best Practices

1. **Design for failure**: Asumsikan semua komponen bisa gagal
2. **Keep events immutable**: Jangan ubah event yang sudah dipublish
3. **Use correlation IDs**: Untuk tracing lintas service
4. **Monitor everything**: Metrics, logs, dan traces

> "Events are facts. They happened. You can't change the past, but you can learn from it."

## Kesimpulan

Event-driven architecture memberikan fleksibilitas dan scalability yang dibutuhkan oleh sistem modern. Dengan memahami patterns dan best practices, kita bisa membangun sistem yang robust dan maintainable.
