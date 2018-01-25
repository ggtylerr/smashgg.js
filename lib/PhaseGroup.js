'use strict';

let _ = require('lodash');
let log = require('winston');
let format = require('util').format;
let moment = require('moment-timezone');
let request  = require('request-promise');
let Cache = require('./util/Cache').getInstance();
let EventEmitter = require('events');

let Set = require('./Set');
let Player = require('./Player');

const PHASE_GROUP_URL = 'https://api.smash.gg/phase_group/%s?%s';

class PhaseGroup extends EventEmitter{

    constructor(id, expands, isCached){
        super();

        if(!id)
            throw new Error('ID cannot be null for Phase Group');

        this.data = {};
        this.id = id;
        this.isCached = ( (isCached == undefined) || (isCached == null) ) ? true : isCached;

        // CREATE THE EXPANDS STRING
        this.expandsString = "";
        this.expands = {
            sets: (expands && expands.sets) || true,
            entrants: (expands && expands.entrants) || true,
            standings: (expands && expands.standings) || true,
            seeds: (expands && expands.seeds) || true
        };
        for(let property in this.expands){
            if(this.expands[property])
                this.expandsString += format('expand[]=%s&', property);
        }

        this.url = format(PHASE_GROUP_URL, this.id, this.expandsString);

        let ThisPhaseGroup = this;
        this.load()
            .then(function(){
                ThisPhaseGroup.emitPhaseGroupReady();
            })
            .catch(function(err){
                log.error('Phase Group: ' + err);
                throw err;
            })
    }

    loadData(data){
        log.debug('PhaseGroup.loadData called');

        this.data = data;
    }

    async load(){
        log.debug('PhaseGroup.load called');

        try{
            if(!this.isCached)
                return await request(this.url);

            let cacheKey = format('phasegroup::%s', this.id);
            let cached = await Cache.get(cacheKey);

            if(!cached){
                let response = await request(this.url);
                this.data = JSON.parse(response);
                await Cache.set(cacheKey, this.data);
                return this.data;
            }
            else {
                this.data = cached;
                return this.data;
            }
        } catch(e){
            log.error('Event.load: ' + e);
            throw e;
        }
    }

    getPlayers(){
        let players = [];
        this.data.entities.entrants.forEach(entrant => {
            let P = Player.resolve(entrant);
            players.push(P);
        });
        this.players = players;
        return this.players;
    }

    findPlayerByParticipantId(id){
        if(!this.players)
            this.getPlayers();
        let player = _.find(this.players, {participantId: id});
        return player;
    }

    getSets(){
        if(!this.players)
            this.getPlayers();

        let sets = [];
        this.data.entities.sets.forEach(set => {
            if(!set.entrant1Id || !set.entrant2Id)
                return; // HANDLES BYES

            let WinnerPlayer = this.findPlayerByParticipantId(set.winnerId);
            let LoserPlayer = this.findPlayerByParticipantId(set.loserId);

            let S = new Set(set.id, set.eventId, set.fullRoundText, WinnerPlayer, LoserPlayer);
            S.loadData(set);
            sets.push(S);
        });
        this.sets = sets;
        return this.sets;
    }

    static resolve(data){
        // TODO instantiate object with data from db

    }

    /** SIMPLE GETTERS **/


    /** EVENTS **/
    emitPhaseGroupReady(){
        this.emit('ready');
    }

}

module.exports = PhaseGroup;
