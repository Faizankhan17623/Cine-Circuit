import Loading from "./Loading";
const Line = ({ part, setPart }) => {
  return (
    <div className="border-b-2 border-red-500">
      <div className="flex justify-center gap-2 items-center  h-14 w-full">
        {[1, 2, 3, 4, 5].map((step) => (
          <>
            <span
              className={`h-9 w-9 flex justify-center items-center text-lg font-bold rounded-full cursor-pointer
                ${step <= part ? 'bg-yellow-300 text-black' : 'bg-gray-600 text-white'}
              `}
              onClick={() => setPart(step)}
              key={step}
            >
              {part && <Loading data="top-50 left-60"/>?step:<Loading data="top-10 left-60"/>}
            </span>

            {/* Line after the step (except after the last one) */}
            {step < 5 && (
              <div
                className={`w-20 h-1 rounded-full ${
                  step <= part ? 'bg-yellow-300' : 'bg-gray-500'
                }`}
              ></div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Line;