import { useEffect } from "react";


export function useChangeTabTitle(loadedEntity: any | undefined) {

    useEffect(() => {
        if (!loadedEntity) return;

        document.title = loadedEntity.name;

        return () => {
            document.title = "Meetup";
        }
    }, [loadedEntity]);

    return {};
}
