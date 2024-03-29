import { transformSession } from "../transformers";

export const getSession = (hash) =>
    fetch(`http://localhost:3004/sessions?hash=${hash}`)
    .then((loadedSession) =>loadedSession.json()
    .then(([loadedSession]) => loadedSession && transformSession(loadedSession))
    )