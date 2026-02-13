import Loading from "./Loading";
const Line = ({ part, setPart }) => {
  return (
    <div className="border-b-2 border-richblack-700">
      <div className="flex justify-center gap-2 items-center h-14 w-full">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`h-9 w-9 flex justify-center items-center text-lg font-bold rounded-full cursor-pointer transition-all duration-300
                ${step <= part
                  ? 'bg-gradient-to-br from-yellow-50 to-yellow-200 text-richblack-900 shadow-md shadow-yellow-400/20'
                  : 'bg-richblack-700 text-richblack-300 hover:bg-richblack-600'}
              `}
              onClick={() => setPart(step)}
            >
              {part && <Loading data="top-50 left-60"/>?step:<Loading data="top-10 left-60"/>}
            </span>

            {/* Line after the step (except after the last one) */}
            {step < 5 && (
              <div
                className={`w-12 md:w-20 h-1 rounded-full transition-colors duration-300 ${
                  step < part ? 'bg-yellow-200' : 'bg-richblack-700'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Line;
