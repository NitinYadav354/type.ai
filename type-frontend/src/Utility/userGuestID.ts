export function getOrCreateGuestID (): string {
    const storageKey = 'guestID';
    let guestID = localStorage.getItem(storageKey);
    if (!guestID) {
        guestID =  `guest_${crypto.randomUUID()}`;
        localStorage.setItem(storageKey, guestID);
    }
    return guestID
}