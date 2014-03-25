folders=( "test/")

for i in "${folders[@]}"
  do
    :
    cd $i
    echo -e "running tests on $i"
    echo "------------------"
    files=(`ls *-test.js`)
    for i in "${files[@]}"
      do
      echo -e "running tests on $i"
      mocha "$i">result
      cat result
      rm result
    done
    cd ../
done
