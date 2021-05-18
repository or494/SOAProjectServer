import Logic from "../Logic/logic";

class GameMapper<T>{
    private gameUserMapper = new Map<T, string[]>();  // index 0 = false, index 1 = true
    private userGameMapper = new Map<string, T>();

    Add = (game: T, user1Id: string, user2Id: string) => {
        if(this.userGameMapper.get(user1Id) !== undefined || this.userGameMapper.get(user2Id) !== undefined) 
            throw new Error('conflict with on of users');
        this.gameUserMapper.set(game, [user1Id, user2Id]);
        this.userGameMapper.set(user1Id, game);
        this.userGameMapper.set(user2Id,game);
    }

    Remove = (userId: string) => {
        const game = this.userGameMapper.get(userId);
        if(game === undefined) throw new Error('game is not defined');
        const gameParticipants = this.gameUserMapper.get(game as T) as string[];
        const secondUserId = gameParticipants[0] !== userId ? gameParticipants[0] : gameParticipants[1];
        this.userGameMapper.delete(userId);
        this.userGameMapper.delete(secondUserId);
        this.gameUserMapper.delete(game);
    }

    GetGameByUser = (userId: string) => {
        const game = this.userGameMapper.get(userId);
        return game;
    }

    GetRivalByUser = (userId: string) => {
        const game = this.userGameMapper.get(userId);
        if(game === undefined) throw new Error('game is not defined');
        const gameParticipants = this.gameUserMapper.get(game as T) as string[];
        const secondUserId = gameParticipants[0] !== userId ? gameParticipants[0] : gameParticipants[1];
        return secondUserId;
    }
}

export default new GameMapper<Logic>();
