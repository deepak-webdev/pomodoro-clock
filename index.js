const audio = document.getElementById("beep");
audio.crossOrigin = "anonymous";

class App extends React.Component {
  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: "Session",
    isPlaying: false,
  };
  constructor(props) {
    super(props);
    this.loop = undefined;
  }

  componentWillMount() {
    clearInterval(this.loop);
  }

  handlePlayPause = () => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      clearInterval(this.loop);
      this.setState({
        isPlaying: false,
      });
    } else {
      this.setState({
        isPlaying: true,
      });
      this.loop = setInterval(() => {
        const { clockCount, currentTimer, breakCount, sessionCount } =
          this.state;
        // logic for break and session time
        if (clockCount === 0) {
          this.setState({
            currentTimer: currentTimer === "Session" ? "Break" : "Session",
            clockCount:
              currentTimer === "Session" ? breakCount * 60 : sessionCount * 60,
          });
          audio.play();
        } else {
          this.setState({
            clockCount: clockCount - 1,
          });
        }
      }, 1000);
    }
  };

  // handleReset for resetting everything to default

  handleReset = () => {
    this.setState({
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: "Session",
      isPlaying: false,
    });
    clearInterval(this.loop);
    audio.pause();
    audio.currentTimer = 0;
  };

  // handler function for increasing and decreasing session and break count
  handleBreakDecreaseTime = () => {
    const { breakCount } = this.state;
    // decrease only if breakCount >0
    if (breakCount > 1) {
      this.setState({
        breakCount: breakCount - 1,
      });
    }
  };
  handleBreakIncreaseTime = () => {
    const { breakCount } = this.state;
    if (breakCount < 60) {
      this.setState({
        breakCount: breakCount + 1,
      });
    }
  };
  handleSessionDecreaseTime = () => {
    const { sessionCount } = this.state;
    if (sessionCount > 1) {
      this.setState({
        sessionCount: sessionCount - 1,
      });
    }
  };
  handleSessionIncreaseTime = () => {
    const { sessionCount } = this.state;
    if (sessionCount < 60) {
      this.setState({
        sessionCount: sessionCount + 1,
      });
    }
  };

  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${minutes}:${seconds}`;
  };
  render() {
    const { breakCount, sessionCount, clockCount, currentTimer, isPlaying } =
      this.state;
    const breakProps = {
      title: "Break",
      counter: breakCount,
      handleDecreaseTime: this.handleBreakDecreaseTime,
      handleIncreaseTime: this.handleBreakIncreaseTime,
    };
    const sessionProps = {
      title: "Session",
      counter: sessionCount,
      handleDecreaseTime: this.handleSessionDecreaseTime,
      handleIncreaseTime: this.handleSessionIncreaseTime,
    };
    return (
      <div>
        <div className="flex">
          <SetTimer {...breakProps} />
          <SetTimer {...sessionProps} />
        </div>
        <div className="clock-container">
          <h1 id="timer-lable">{currentTimer}</h1>
          <span id="time-left">{this.convertToTime(clockCount)}</span>
          <div className="flex">
            <button id="start_stop" onClick={this.handlePlayPause}>
              <i class={`fa fa-${isPlaying ? "pause" : "play"}`} />
            </button>
            <button id="reset" onClick={this.handleReset}>
              <i class="fa fa-sync" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// component for setting timezone
const SetTimer = (props) => {
  const id = props.title.toLowerCase();
  return (
    <div className="timer-container">
      <h1 id={`${id}-label`}>{props.title} Length</h1>
      <div className="flex button-wrapper">
        <button id={`${id}-decrement`} onClick={props.handleDecreaseTime}>
          <i class="fa fa-minus" />
        </button>
        <span di={`${id}-length`}>{props.counter}</span>
        <button id={`${id}-increment`} onClick={props.handleIncreaseTime}>
          <i className="fa fa-plus" />
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
