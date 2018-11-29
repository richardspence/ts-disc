class ErrorHelper{

    public async do(){
        await this._throwsError();
    }

    private async _throwsError(){
        throw new Error('Arrgg');
    }
}
var e = new ErrorHelper();
e.do().then(c=>console.log(e), e=>console.error(e));
