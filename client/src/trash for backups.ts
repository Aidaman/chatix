// public join$: Observable<IRoom[]> = this.socketService.listenJoin().pipe(
//   map((data) => {
//     console.log('this is socketService listen "Join" data', data);
//     if (!data) return [];
//
//     let rooms = data.rooms;
//     this.router.navigate(['/chat', rooms[0]._id]);
//     // rooms = rooms.map((room: IRoom, index: number) => {
//     //   room.lastAction = new Date(room.lastAction);
//     //   return {...room, index};
//     // });
//     this.listOfRooms.next(rooms);
//     // this.selectedRoom = rooms.find((room: IRoom) => room._id === this.localStorageService.getlastRoomId()) || rooms[0];
//
//     return rooms
//   }),
//   takeUntil(this.chatService.termination$),
// );
