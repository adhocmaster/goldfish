
# Login:

UserService -> login (gets token and sets cookie. dispatches login actions)
UserService -> logout (clears cookie, dispatches log out action) -> settings reducer resets settingsState.


