"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = "query EventByTournamentSlugQuery($slug:String){\n    tournament(slug:$slug){\n        id\n        name\n        slug\n        events{\n            id\n            name\n            slug\n            state\n            startAt\n          \tnumEntrants\n          \tcheckInBuffer\n          \tcheckInDuration\n          \tcheckInEnabled\n            isOnline\n          \tteamNameAllowed\n          \tteamManagementDeadline\n        }\n  \t}\n}";
exports.eventPlayers = "query EventParticipantQuery($slug: String, $eventIds: [Int]) {\n    tournament(slug: $slug){\n        id\n        name\n        slug\n        participants(query: {\n            page: 0,\n            perPage: 10000,\n            sortBy: \"asc\",\n            filter: {\n                eventIds: $eventIds\n            }\n        },\n        isAdmin: false){\n            nodes{\n                id\n                playerId\n                gamerTag\n                prefix\n            }\n        }\n    }  \n}";
exports.eventVideoGame = "query EventVideoGame($slug: String){\n    \n}";
exports.eventWithEverything = "query EventByTournamentSlugQuery($slug:String){\n    tournament(slug:$slug){\n        id\n        events{\n            id\n            name\n            slug\n            startAt\n          \tnumEntrants\n          \tcheckInBuffer\n          \tcheckInDuration\n          \tcheckInEnabled\n          \tteamNameAllowed\n          \tteamManagementDeadline\n          \tprizingInfo\n          \tvideogame {\n          \t  id\n              name\n              slug\n              displayName\n          \t}\n            tournament{\n\t\t\t  id\n              name\n              slug\n              city\n              postalCode\n              addrState\n              countryCode\n              region\n              venueAddress\n              venueName\n              gettingThere\n              lat\n              lng\n              timezone\n              startAt\n              endAt\n              contactInfo\n              contactEmail\n              contactTwitter\n              contactPhone\n              ownerId\n            }\n        }\n    }\n}";
