import { Component } from '@angular/core';
import { Observable, ConnectableObservable, Subject, of, interval, fromEvent } from 'rxjs';
import { publish, multicast, share, shareReplay, tap, withLatestFrom, take, map, mergeMap, startWith, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  letters = 'ABCDEFG';
  step = 0;
  resolved = false;
  output = '';
  questions = [
    {
      title: 'What are side effects? (1)',
      desc: `
        <cite>Functional programming in general tries to avoid creating any side effects.</cite>
        <a href="http://introtorx.com/Content/v1.0.10621.0/09_SideEffects.html">http://introtorx.com/Content/v1.0.10621.0/09_SideEffects.html</a>
        <cite>Eliminating side effects, that is, changes in state that do not depend on the function inputs, can make understanding a program easier, which is one of the key motivations for the development of functional programming.</cite>
        <a href="https://en.wikipedia.org/wiki/Functional_programming">https://en.wikipedia.org/wiki/Functional_programming</a>
        <br><br>Which of these JavaScript functions has side effects?
      `,
      answers: [
        `(a, b) => a + b`,
        `(url) => fetch(url)`,
        `(a, b) => Math.abs(a - b)`,
        `(a, b) => a > b ? 2 : 9`,
      ],
      correct: 1,
    },
    {
      title: 'What are side effects? (2)',
      desc: `
       <cite>A pure function is a function where the return value is only determined by its input values, without observable side effects.</cite>
       <a href="https://www.sitepoint.com/functional-programming-pure-functions/">https://www.sitepoint.com/functional-programming-pure-functions/</a>
       <br><br>What is <b>not</b> a benefit of using pure functions and therefore avoiding side effects?
       `,
      answers: [
        `testing gets easier`,
        `problems can be split into smaller sub problems (divide et impera)`,
        `debugging gets easier`,
        `most programming languages enforce the functional paradigm`,
      ],
      correct: 3,
    },
    {
      title: 'What is multicasting?',
      desc: `
        <cite>In RxJS observables are cold, or unicast by default.
        Some operators can make an observable hot, or multicast, allowing side-effects to be shared among multiple subscribers.</cite>
        <br><br>Which of these is a complete list of the multicasting operators?
      `,
      answers: [
        `multicast, combine, share, merge`,
        `publish, multicast, share, shareReplay`,
        `replay, retry, generate`,
        `multicast, shareReplay`,
      ],
      correct: 1,
    },
    {
      title: 'The publish operator (1)',
      desc: `
        <cite>Share source and make hot by calling connect.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-publish-1.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          observer.next(8);
        });

        const obsPublished = obs.pipe(
          publish(),
        );

        obs.subscribe(val => this.writeConsole('A', val));
        obsPublished.subscribe(val => this.writeConsole('B', val));
      },
      answers: [
        `nothing`,
        `A 8`,
        `A 8, B 8`,
        `B 8, A 8`,
      ],
      correct: 1,
    },
    {
      title: 'The publish operator (2)',
      desc: `
        <cite>Share source and make hot by calling connect.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-publish-2.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          observer.next(8);
        });

        const obsPublished = obs.pipe(
          publish(),
        );

        obsPublished.subscribe(val => this.writeConsole('A', val));
        obsPublished.subscribe(val => this.writeConsole('B', val));

        (obsPublished as ConnectableObservable<string>).connect();
      },
      answers: [
        `nothing`,
        `B 8, B 8`,
        `A 8, B 8`,
        `B 8, A 8`,
      ],
      correct: 2,
    },
    {
      title: 'The publish operator (3)',
      desc: `
        <cite>Share source and make hot by calling connect.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-publish-3.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          observer.next(8);
        });

        const obsPublished = obs.pipe(
          publish(),
        );

        obsPublished.subscribe(val => this.writeConsole('A', val));

        (obsPublished as ConnectableObservable<string>).connect();

        obsPublished.subscribe(val => this.writeConsole('B', val));
        obsPublished.subscribe(val => this.writeConsole('C', val));
      },
      answers: [
        `A 8`,
        `A 8, B 8, C 8`,
      ],
      correct: 0,
    },
    {
      title: 'The publish operator (4)',
      desc: `
        <cite>Share source and make hot by calling connect.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-publish-4.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          observer.next(8);
        });

        const obsPublished = obs.pipe(
          publish(),
        );

        obsPublished.subscribe(val => this.writeConsole('A', val));

        (obsPublished as ConnectableObservable<string>).connect();

        obsPublished.subscribe(val => this.writeConsole('B', val));
        obsPublished.subscribe(val => this.writeConsole('C', val));

        (obsPublished as ConnectableObservable<string>).connect();
      },
      answers: [
        `A 8`,
        `A 8, B 8, C 8`,
        `A 8, A 8, B 8, C 8`,
        `B 8, C 8`,
      ],
      correct: 0,
    },
    {
      title: 'The multicast operator (1)',
      desc: `
        <cite>Share source utilizing the provided Subject.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-multicast-1.png"></div>
      `,
      run: () => {
        const sub = new Subject<number>();

        sub.subscribe(val => this.writeConsole('subject', val));

        const obs = of(3).pipe(
          multicast(sub),
        );

        obs.subscribe(val => this.writeConsole('obs', val));

        (obs as ConnectableObservable<number>).connect();

        sub.next(6);
      },
      answers: [
        `subject 3, obs 3, subject 6`,
        `obs 3, obs 6`,
        `subject 3, obs 3, obs 6, subject 6`,
        `subject 3, obs 3`,
      ],
      correct: 3,
    },
    {
      title: 'The share operator (1)',
      desc: `
        <cite>Share source among multiple subscribers.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-share-1.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          this.writeConsole(0);
        });

        const shared = obs.pipe(
          share(),
        );

        shared.subscribe();
        shared.subscribe();
        shared.subscribe();
      },
      answers: [
        `nothing`,
        `0, 0, 0, 0, 0, 0`,
        `0`,
        `0, 0, 0`,
      ],
      correct: 2,
    },
    {
      title: 'The share operator (2)',
      desc: `
        <cite>Share source among multiple subscribers.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-share-2.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          this.writeConsole(0);
        });

        const shared = obs.pipe(
          share(),
        );

        const sub1 = shared.subscribe();
        const sub2 = shared.subscribe();

        sub1.unsubscribe();
        sub2.unsubscribe();

        const sub3 = shared.subscribe();
        sub3.unsubscribe();
      },
      answers: [
        `0`,
        `0, 0`,
        `0, 0, 0`,
        `0, 0, 0, 0`,
      ],
      correct: 1,
    },
    {
      title: 'The shareReplay operator (1)',
      desc: `
        <cite>Share source and replay specified number of emissions on subscription.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-share-replay-1.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          this.writeConsole(0);
          observer.next(1);
        });

        const shared = obs.pipe(
          shareReplay(),
        );

        shared.subscribe(val => this.writeConsole('A', val));
        shared.subscribe(val => this.writeConsole('B', val));
      },
      answers: [
        `0, A 0, B 0`,
        `0, A 1, B 1`,
        `0, A 0, A 1, 0, B 0, B 1`,
        `0, A 0, B 0, 0, A 1, B 1`,
      ],
      correct: 1,
    },
    {
      title: 'The shareReplay operator (2)',
      desc: `
        <cite>Share source and replay specified number of emissions on subscription.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-share-replay-2.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          this.writeConsole(0);
          observer.next(1);
        });

        const shared = obs.pipe(
          shareReplay(),
        );

        shared
          .subscribe(val => this.writeConsole('A', val))
          .unsubscribe();

        shared
          .subscribe(val => this.writeConsole('B', val))
          .unsubscribe();
      },
      answers: [
        `0, A 0, B 0`,
        `0, A 1, B 1`,
        `0, A 1, 0, B 1`,
        `0, A 0, B 0, 0, A 1, B 1`,
      ],
      correct: 2,
    },
    {
      title: 'The shareReplay operator (3)',
      desc: `
        <cite>Share source and replay specified number of emissions on subscription.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-share-replay-3.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          this.writeConsole(0);
          observer.next(1);
        });

        const shared = obs.pipe(
          shareReplay(),
        );

        shared.pipe(
          tap(val => this.writeConsole('B', val)),
        );

        shared
          .subscribe(val => this.writeConsole('A', val))
          .unsubscribe();
      },
      answers: [
        `0, A 1`,
        `0, A 0, B 0`,
        `0, A 1, 0, B 1`,
        `0, B 1`,
      ],
      correct: 0,
    },
    {
      title: 'The shareReplay operator (4) Bonus question! 🙉',
      desc: `
        <cite>Share source and replay specified number of emissions on subscription.</cite>
        <br><br>What will the following code write to the console?
        <div class="img-wrap"><img src="./assets/code-share-replay-4.png"></div>
      `,
      run: () => {
        const obs = new Observable(observer => {
          observer.next(1);
          setTimeout(() => observer.next(2), 1000);
        });

        obs.pipe(
          withLatestFrom(obs),
          tap(([a, b]) => this.writeConsole(a, b)),
        ).subscribe();
      },
      answers: [
        `2 1`,
        `1 1, 2 2`,
        `1 2, 1 2`,
        `infinite loop!`,
      ],
      correct: 0,
    },
    {
      title: 'RxJS Operators',
      desc: `
        RxJS offers 100+ operators for all kinds of use cases. The crucial ones are marked with a star in the official documentation.
        <a href="https://www.learnrxjs.io/operators/">https://www.learnrxjs.io/operators/</a>
      `,
      correct: 0,
    },
  ];

  writeConsole(...args: any[]) {
    this.output += args.join(' ')
      .replace(/ /g, '&nbsp;') + '<br>';
    console.log.apply(null, args);
  }
}
