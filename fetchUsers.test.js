import { fetchUsers} from '../fetchUsers.js';
import { expect } from 'chai';
import { afterEach, describe } from 'mocha';
import sinon from 'sinon';

describe('fetchUsers', function () {
    it('should return an array of users', async function (){
        const users = await fetchUsers();
        expect(users).to.be.an('array');
    })

    describe('fetchUsers unsung stub', function () {
        let stub;
        const testUsers = [
            {id: 1, name: 'Corner One'},
            {id: 2, name: 'Corner Two'}
        ]

        beforeEach(function () {
            stub = sinon.stub(global, 'fetch');
            stub.resolve({
                ok: true,
                json: async () => testUsers,
            })
        })
        afterEach( function () {
            stub.restore();
        })

        it('should return the same users as the API returns', async function(){
            const users = await fetchUsers();
            expect(users).to.have.lengthOf(2);
            expect(users).to.deep.equal(testUsers);
        })

        it('should print names', function(done){
            expect(consoleSpy.calledTwice).to.be.true;
            testUsers.forEach(user => {
                expect(consoleSpy.calledWith(user.name)).to.be.true
            });
            fetchUsers();
            done();
        })
    })

    it('should return undefined when the API fails', async function(){
        let errorstub = sinon.stub(global, 'fetch');
        try {
            errorstub.rejects(new Error('Network error'));
            const users = await fetchUsers();
            expect(users).to.be.undefined;
        } finally {
            errorstub.restore();
        }
    })
})