import { EventArguments, EventType } from "./Events";

type EventHandler<T> = (args: T) => void;

class EventBus {
    private events: { [K in EventType]?: EventHandler<EventArguments[K]>[] } = {};

    public subscribe<K extends keyof EventArguments>(eventType: K, handler: EventHandler<EventArguments[K]>): void {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        this.events[eventType]!.push(handler);
    }

    public emit<K extends keyof EventArguments>(eventType: K, args: EventArguments[K]): void {
        const eventHandlers = this.events[eventType];
        if (eventHandlers) {
            eventHandlers.forEach(handler => handler(args));
        }
    }
}

const eventBus = new EventBus();

export default eventBus;